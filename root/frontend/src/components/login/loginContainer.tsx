import React, { useState } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, provider, db } from "../../firebase-config";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/constants.tsx";
import LoadingDots from "../Loading.tsx";

export default function LoginContainer() {
  const [errorMessageText, setErrorMessageText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAPI = async () => {
    try {
      const localStorageUID = localStorage.getItem("UID");
      if (localStorageUID) {
        const username = localStorageUID.replace(/"/g, "");
        const response = await api.post("/app/token/", {
          username: username,
          email: email,
          password: password,
        });

        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      }
    } catch (error) {
      alert(error);
    }
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        localStorage.setItem("IsAuth", JSON.stringify(true));
        const user = auth.currentUser;
        if (user) {
          localStorage.setItem("Name", JSON.stringify(user.displayName));
          localStorage.setItem("UID", JSON.stringify(user.uid));

          const uid = user.uid;
          const docRef = doc(db, uid, "user");
          console.log("loading");
          await setDoc(docRef, {
            name: user.displayName,
            email: user.email,
          });

          // await handleAPI();
          console.log("done loading");
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setData = async (user: User) => {
    if (localStorage.getItem("IsAuth")) {
      const currentUser = await user;
      const docRef = doc(db, currentUser.uid, "user");
      const docSnap = await getDoc(docRef);
      while (!docSnap.exists()) {}
      if (docSnap.exists()) {
        localStorage.setItem("UID", JSON.stringify(user.uid));
        localStorage.setItem("Name", docSnap.data().name);
      }

      await handleAPI();
    }
  };

  const signInWithEmail = () => {
    let errorDisplay = document.getElementById("accountError");

    if (errorDisplay) {
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed in
          localStorage.setItem("IsAuth", JSON.stringify(true));
          setErrorMessageText("");
          errorDisplay.style.marginBottom = "";
          const user = userCredential.user;
          const loadingDots = document.getElementById("loadingDots");
          if (loadingDots) {
            loadingDots.style.display = "flex";
          }
          await setData(user);
          if (loadingDots) {
            loadingDots.style.display = "none";
          }
          window.location.href = "/";
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
      <LoadingDots />
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
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
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
      {/* <button className="button__google-login" onClick={signInWithGoogle}>
        Sign in with Google
      </button> */}
      <a href="/signup">
        <h3 className="text__login-signup">Need an account? Sign up here!</h3>
      </a>
    </div>
  );
}
