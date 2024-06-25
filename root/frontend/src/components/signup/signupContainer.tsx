import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, provider, db } from "../../firebase-config";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/constants.tsx";

var valid = false;

export default function SignUpContainer() {
  const [accountErrorText, setAccountErrorText] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleAPI = async () => {
    try {
      const localStorageUID = localStorage.getItem("UID");
      if (localStorageUID) {
        const username = localStorageUID.replace(/"/g, "");
        const response = await api.post("/app/user/register/", {
          username: username,
          email: email,
          password: password,
        });

        const loginResponse = await api.post("/app/token/", {
          username: username,
          email: email,
          password: password,
        });

        localStorage.setItem(ACCESS_TOKEN, loginResponse.data.access);
        localStorage.setItem(REFRESH_TOKEN, loginResponse.data.refresh);
      }
    } catch (error) {
      alert(error);
    }
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        localStorage.setItem("IsAuth", JSON.stringify(true));
        const user = auth.currentUser;
        if (user) {
          localStorage.setItem("Name", JSON.stringify(user.displayName));
          localStorage.setItem("UID", JSON.stringify(user.uid));
          const uid = user.uid;
          const docRef = doc(db, uid, "user");
          setDoc(docRef, {
            name: user.displayName,
            email: user.email,
          });
        }
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createAccount = async () => {
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        if (user) {
          localStorage.setItem("Name", name);
          localStorage.setItem("UID", JSON.stringify(user.uid));
          localStorage.setItem("IsAuth", JSON.stringify(true));
          const dataId: string = user.uid;
          const docRef = doc(db, dataId, "user");
          console.log("loading");
          await setDoc(docRef, {
            name: name,
            email: email,
          });

          await handleAPI();
          console.log("done loading");

          window.location.href = "/";
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/weak-password") {
          setAccountErrorText(
            "Password too weak, please enter atleast 6 characters"
          );
        } else if (errorCode === "auth/email-already-in-use") {
          setAccountErrorText("Email already in use");
        } else if (errorCode === "auth/invalid-email") {
          setAccountErrorText("Invalid email");
        }
      });
  };
  const processAccountCreation = () => {
    if (valid) {
      createAccount();
    }
  };

  const onClickGoogle = () => {
    signInWithGoogle();
  };

  const confirmPassword = () => {
    const password = document.getElementById("password") as HTMLInputElement;
    const confirm = document.getElementById(
      "confirmPassword"
    ) as HTMLInputElement;

    if (password && confirm) {
      valid = true;

      if (password.value !== confirm.value && confirm.value !== "") {
        setAccountErrorText("Passwords do not match");
        valid = false;
      } else {
        setAccountErrorText("");
      }
    }
  };

  return (
    <div>
      <div className="container__signup" id="signUpContainer">
        <h1 className="header__login-signup">Create Your Account</h1>
        <div className="field container__eplogin-signup">
          <label htmlFor="name" className="label__login-signup">
            Name
          </label>
          <input
            id="name"
            className="input__login-signup"
            placeholder="Enter your name..."
            autoComplete="none"
            onChange={(e) => setName(e.target.value)}
          />
          <span className="span__login-signup--label" aria-hidden="true">
            <span className="span__login-signup--placeholder">Name</span>
          </span>
        </div>
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
        <div className="field container__eplogin-signup">
          <label htmlFor="confirmPassword" className="label__login-signup">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            className="input__login-signup"
            placeholder=""
            autoComplete="none"
            type="password"
            onChange={(e) => {
              setPasswordConfirm(e.target.value);
              confirmPassword();
            }}
          />
          <span className="span__login-signup--label" aria-hidden="true">
            <span className="span__login-signup--placeholder">
              Confirm Password
            </span>
          </span>
        </div>
        <p id="accountError" className="text__signup--error">
          {accountErrorText}
        </p>
        <button
          id="signupButton"
          onClick={processAccountCreation}
          className="button__signup"
        >
          Create Account
        </button>
        <button className="button__google-signup" onClick={onClickGoogle}>
          Sign up with Google
        </button>
        <a href="/login">
          <h3 className="text__login-signup">
            Already have an account? Log in here!
          </h3>
        </a>
      </div>
    </div>
  );
}
