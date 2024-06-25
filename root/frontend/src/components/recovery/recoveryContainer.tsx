import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "../../firebase-config";

export default function RecoveryContainer() {
  const [errorMessage, setErrorMessage] = useState("");

  const back = () => {
    const user = auth.currentUser;

    if (localStorage.getItem("recoveryBack") === "/account" && user) {
      window.location.href = "/account/" + user.uid;
    } else {
      window.location.href = "/login";
    }
  };
  const confirmNewPassword = () => {
    const oldPassword = document.getElementById(
      "oldPassword"
    ) as HTMLInputElement;
    const newPassword = document.getElementById(
      "newPassword"
    ) as HTMLInputElement;
    const newPasswordConfirm = document.getElementById(
      "newPasswordConfirm"
    ) as HTMLInputElement;
    const user = auth.currentUser;

    if (oldPassword && newPassword && newPasswordConfirm && user) {
      const oldPasswordValue = oldPassword.value;
      const newPasswordValue = newPassword.value;
      const newPasswordConfirmValue = newPasswordConfirm.value;

      if (
        newPasswordValue !== newPasswordConfirmValue &&
        newPasswordConfirmValue !== ""
      ) {
        setErrorMessage("Passwords do not match");
      } else {
        console.log("ran");
        const cred = EmailAuthProvider.credential(
          JSON.stringify(user.email),
          oldPasswordValue
        );
        reauthenticateWithCredential(user, cred)
          .then(() => {
            updatePassword(user, newPasswordValue)
              .then(() => {
                if (localStorage.getItem("recoveryBack") === "/account") {
                  window.location.href = "/account/" + user.uid;
                } else {
                  window.location.href = "/login";
                }
              })
              .catch((error) => {
                const errorCode = error.code;
                if (errorCode === "auth/weak-password") {
                  setErrorMessage(
                    "Password too weak, please enter atleast 6 characters"
                  );
                }
                console.log(errorCode);
              });
          })
          .catch((error) => {
            setErrorMessage("Current password is incorrect");
          });
      }
    }
  };
  return (
    <div className="container__signup" id="loginContainer">
      <h1 className="header__login-signup">Recover Password</h1>
      <div className="field container__eplogin-signup">
        <label htmlFor="oldPassword" className="label__login-signup">
          Current Password
        </label>
        <input
          id="oldPassword"
          className="input__login-signup"
          placeholder=" "
          autoComplete="none"
          type="password"
        />
        <span className="span__login-signup--label" aria-hidden="true">
          <span className="span__login-signup--placeholder">
            Current Password
          </span>
        </span>
      </div>
      <div className="field container__eplogin-signup">
        <label htmlFor="newPassword" className="label__login-signup">
          New Password
        </label>
        <input
          id="newPassword"
          className="input__login-signup"
          placeholder=" "
          autoComplete="none"
          type="password"
        />
        <span className="span__login-signup--label" aria-hidden="true">
          <span className="span__login-signup--placeholder">New Password</span>
        </span>
      </div>
      <div className="field container__eplogin-signup">
        <label htmlFor="newPasswordConfirm" className="label__login-signup">
          Confirm New Password
        </label>
        <input
          id="newPasswordConfirm"
          className="input__login-signup"
          placeholder=" "
          autoComplete="none"
          type="password"
        />
        <span className="span__login-signup--label" aria-hidden="true">
          <span className="span__login-signup--placeholder">
            Confirm New Password
          </span>
        </span>
      </div>
      <p id="accountError" className="text__recovery--error">
        {errorMessage}
      </p>
      <button
        onClick={confirmNewPassword}
        className="button__recover button__basic"
      >
        Change Password
      </button>
      <button onClick={back} className="button__recover button__basic ">
        Back
      </button>
    </div>
  );
}
