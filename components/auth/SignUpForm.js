import React, { useState } from "react";
import Link from 'next/link';
import Card from "../ui/Card";
import { useForm } from "react-hook-form";
import { signUp } from "../../helpers/apiCalls";

import classes from './Form.module.css';

export default function SignUpForm() {
  const [passwordError, setPasswordError] = useState("");
  const [apiErrors, setApiErrors] = useState();
  const [formSubmitSuccess,setFormSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    setFormSubmitSuccess(false);
    setApiErrors(null);
    setPasswordError("");
    if (data.password !== data.confirmPassword) {
      setPasswordError("Passwords must match!");
      return;
    }

    const user = {
      username: data.username,
      email: data.email,
      password: data.password
    }

    const response = await signUp(user);
    if(response.status === 400) {
      const errors = await response.json();
      setApiErrors(errors);
    } else {
      setFormSubmitSuccess(true);
    }

  };

  let passwordErrorMessage = "";

  if (errors.password) {
    passwordErrorMessage =
      errors.password.type === "minLength"
        ? "Password must be at least 6 characters long!"
        : errors.password.message;
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <h2>Sign Up </h2>
        {apiErrors && <div className={classes.apiErrors}>{apiErrors.map(error => <p key={error}>{error}</p>)}</div>}
        {formSubmitSuccess && <div className={classes.success}><p>You account has been created!</p><p>Check your email to confirm registration.</p></div>}
        <div className={classes.control}>
          <label htmlFor="username">Your username</label>
          <input
            type="text"
            id="username"
            placeholder="LilPip420"
            {...register("username", { required: "Username is required!" })}
          />
          {errors.username && <p>{errors.username.message}</p>}
        </div>
        <div className={classes.control}>
          <label htmlFor="email">Your email</label>
          <input
            type="email"
            id="email"
            placeholder="example@c2.hu"
            {...register("email", { required: "Email is required!" })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your password</label>
          <input
            type="password"
            id="password"
            placeholder="SuperSecretPassword123"
            {...register("password", {
              required: "Password is required!",
              minLength: 6,
            })}
          />
          {errors.password && <p>{passwordErrorMessage}</p>}
        </div>
        <div className={classes.control}>
          <label htmlFor="confirmPasword">Confirm Your password</label>
          <input
            type="password"
            id="confirmPasword"
            placeholder="SuperSecretPassword123Again"
            {...register("confirmPassword", {
              required: "Password confirmation is required!",
            })}
          />
          {passwordError && <p>{passwordError}</p>}
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>
        <div className={classes.actions}>
          <button type="submit" disabled={formSubmitSuccess}>Sign Up</button>
          <Link href="/sign-in">Already have an account?</Link>
        </div>
      </form>
    </Card>
  );
}
