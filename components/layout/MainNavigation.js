import React from "react";
import Link from "next/link";
import classes from "./MainNavigation.module.css";
import { signOut } from "../../helpers/apiCalls";
import { useRouter } from "next/router";

export default function MainNavigation() {
  const router = useRouter();

  const logoutHandler = () => {
    const isSuccess = signOut();

    if (isSuccess) {
      router.replace("/sign-in");
    } else {
      alert("Oops! Couldn't logout, please try again.");
    }
  };

  return (
    <header className={classes.header}>
      <div className={classes.logo}>WWTBAM</div>
      <nav>
        <ul>
          <li>
            <Link href="#">Contribute</Link>
          </li>
          <li>
            <Link href="#">Username</Link>
          </li>
          <li>
            <button onClick={logoutHandler}>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
