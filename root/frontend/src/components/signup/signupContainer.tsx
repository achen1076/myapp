import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithCredential,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  deleteUser,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, provider, db } from "../../firebase-config";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/constants.tsx";
import LoadingDots from "../Loading.tsx";

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

  const signInWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        localStorage.setItem("IsAuth", JSON.stringify(true));
        const user = auth.currentUser;
        if (user) {
          localStorage.setItem("Name", JSON.stringify(user.displayName));
          localStorage.setItem("UID", JSON.stringify(user.uid));
          const uid = user.uid;
          const docRef = doc(db, uid, "user");
          await setDoc(docRef, {
            name: name,
            email: email,
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
          const loadingDots = document.getElementById("loadingDots");
          if (loadingDots) {
            loadingDots.style.display = "flex";
          }
          await setDoc(docRef, {
            name: name,
            email: email,
          });

          await handleAPI();
          if (loadingDots) {
            loadingDots.style.display = "none";
          }
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
          // try {
          //   var credential = EmailAuthProvider.credential(email, password);
          //   signInWithPopup(auth, provider)
          //     .then((result) => {
          //       localStorage.setItem("IsAuth", JSON.stringify(true));
          //       const user = auth.currentUser;

          //       if (user) {
          //         if (user.email != email) {
          //           localStorage.clear();
          //           deleteUser(user);
          //           const error = new Error("different emails");
          //           error["code"] = "auth/different-email";
          //           throw error;
          //         }
          //         localStorage.setItem(
          //           "Name",
          //           JSON.stringify(user.displayName)
          //         );
          //         localStorage.setItem("UID", JSON.stringify(user.uid));
          //         linkWithCredential(user, credential).then((user) => {
          //           signInWithEmailAndPassword(auth, email, password)
          //             .then(async (userCredential) => {
          //               // Signed in
          //               localStorage.setItem("IsAuth", JSON.stringify(true));
          //               const user = userCredential.user;
          //               localStorage.setItem("UID", JSON.stringify(user.uid));
          //               localStorage.setItem(
          //                 "Name",
          //                 JSON.stringify(user.displayName)
          //               );
          //               window.location.href = "/";
          //             })
          //             .catch((error) => {
          //               console.log(error.code);
          //               setAccountErrorText(
          //                 "Google email different than entered email"
          //               );
          //             });
          //         });
          //       }
          //     })
          //     .catch((error) => {
          //       setAccountErrorText("Account already exists");
          //     });
          // } catch (error) {
          //   console.log("Account linking error", error);
          //   setAccountErrorText("Email already in use");
          // }
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
        <LoadingDots />
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
        {/* <button className="button__google-signup" onClick={onClickGoogle}>
          Sign up with Google
        </button> */}
        <a href="/login">
          <h3 className="text__login-signup">
            Already have an account? Log in here!
          </h3>
        </a>
      </div>
    </div>
  );
}
