import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase-config";

export default function PasswordReset() {
  const [passwordError, setPasswordError] = useState("");
  const passwordResetEmail = () => {
    const user = auth.currentUser;
    if (user) {
      const providerID = user.providerData[0]["providerId"];
      if (providerID !== "google.com") {
        const email: string = JSON.stringify(user.email);
        sendPasswordResetEmail(auth, email)
          .then(() => {
            setPasswordError(
              "Password reset email sent, please check your email and follow those instructions"
            );
          })
          .catch((error) => {
            setPasswordError("Something went wrong, please try again later");
          });
      } else if (providerID === "google.com") {
        setPasswordError(
          "Your account is created through Google, if you are having password issues, please do so through them."
        );
      }
    }
  };

  const passwordReset = () => {
    const user = auth.currentUser;
    if (user) {
      const providerID = user.providerData[0]["providerId"];
      if (providerID !== "google.com") {
        setPasswordError("");
        localStorage.setItem("recoveryBack", "/account");
        window.location.href = "/recovery";
      } else if (providerID === "google.com") {
        setPasswordError(
          "Your account is created through Google, if you are having password issues, please do so through them."
        );
      }
    }
  };

  return (
    <React.Fragment>
      <p className="text__account--password-error" id="passwordError">
        {passwordError}
      </p>
      <span className="span__account--password-buttons" id="spanPassword">
        <button
          className="button__account"
          id="accountButton"
          onClick={passwordResetEmail}
        >
          Reset Password Via Email
        </button>
        <button
          className="button__account"
          id="accountButton"
          onClick={passwordReset}
        >
          Reset Password Other Method
        </button>
      </span>
    </React.Fragment>
  );
}
