import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../navbar";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import {
  auth,
  provider,
  db,
} from "C:/Users/achen/myapp/src/firebase-config.js";

export default function LoginContainer() {
  const [errorMessageText, setErrorMessageText] = useState("");

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        localStorage.setItem("IsAuth", JSON.stringify(true));
        const user = auth.currentUser;
        if (user) {
          localStorage.setItem("Name", JSON.stringify(user.displayName));
          const uid = user.uid;
          const docRef = doc(db, uid, "user");
          setDoc(docRef, {
            name: user.displayName,
            email: user.email,
            phone: user.phoneNumber,
          });
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setData = async (user) => {
    if (localStorage.getItem("IsAuth")) {
      const currentUser = await user;
      const docRef = doc(db, currentUser.uid, "user");
      const docSnap = await getDoc(docRef);
      while (!docSnap.exists()) {}
      if (docSnap.exists()) {
        if (auth.currentUser) {
          localStorage.setItem("Name", JSON.stringify(user.displayName));
          localStorage.setItem("Name", docSnap.data().name);
        }
      }
      window.location.href = "/";
    }
  };

  const signInWithEmail = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    let errorDisplay = document.getElementById("accountError");

    if (email && password && errorDisplay) {
      console.log(email.value, password.value);
      signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
          // Signed in
          localStorage.setItem("IsAuth", JSON.stringify(true));
          setErrorMessageText("");
          errorDisplay.style.marginBottom = "";
          const user = userCredential.user;
          setData(user);
        })
        .catch((error) => {
          console.log(error.message);
          setErrorMessageText("Email or password is incorrect");
          errorDisplay.style.marginBottom = "-10%";
          errorDisplay.style.display = "block";
        });
    }
  };

  return (
    <div className="container__login" id="loginContainer">
      <h1 className="header__login-signup">Login</h1>
      <div className="field container__eplogin-signup">
        <label htmlFor="email" className="label__login-signup">
          E-mail
        </label>
        <input
          id="email"
          className="input__login-signup"
          placeholder="Enter your email..."
          autoComplete="none"
        />
        <span className="span__login-signup--label" aria-hidden="true">
          <span className="span__login-signup--placeholder">E-mail</span>
        </span>
      </div>
      <div className="field container__eplogin-signup">
        <label htmlFor="password" className="label__login-signup">
          Password
        </label>
        <input
          id="password"
          className="input__login-signup"
          placeholder=" "
          autoComplete="none"
          type="password"
        />
        <span className="span__login-signup--label" aria-hidden="true">
          <span className="span__login-signup--placeholder">Password</span>
        </span>
      </div>
      <p id="accountError" className="text__signup--error">
        {errorMessageText}
      </p>
      <button
        id="login-signupButton"
        onClick={signInWithEmail}
        className="button__login"
      >
        Login
      </button>
      <button className="button__google-login" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <a href="/signup">
        <h3 className="text__login-signup">Need an account? Sign up here!</h3>
      </a>
    </div>
  );
}
