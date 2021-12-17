import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/router';
import Card from "../ui/Card";
import { useForm } from "react-hook-form";
import { signIn } from "../../helpers/apiCalls";

import classes from "./Form.module.css";

export default function SignInForm() {
  const [apiError, setApiError] = useState();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    setApiError(null);

    let credentials = {
      identifier: data.identifier,
      password: data.password,
    };

    const response = await signIn(credentials);
    console.log(response);
    if (response.status === "error") {
      setApiError(response.message);
    } else {
      router.push("/");
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <h2>Sign In </h2>
        {apiError && (
          <div className={classes.apiErrors}>
            <p>{apiError}</p>
          </div>
        )}
        <div className={classes.control}>
          <label htmlFor="identifier">Username or Email</label>
          <input
            type="text"
            id="identifier"
            placeholder="LilPip420 | lilp@gmail.com"
            {...register("identifier", {
              required: "Username or Email is required!",
            })}
          />
          {errors.identifier && <p>{errors.identifier.message}</p>}
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="SuperSecretPassword123"
            {...register("password", {
              required: "Password is required!",
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div className={classes.actions}>
          <button type="submit">
            Sign In
          </button>
          <Link href="/sign-up">Dont have an account yet?</Link>
        </div>
      </form>
    </Card>
  );
}
