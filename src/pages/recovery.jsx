import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/navbar";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import {
  auth,
  provider,
  db,
} from "C:/Users/achen/myapp/src/firebase-config.js";

export class RecoveryScreen extends Component {
  constructor() {
    super();
    this.state = {
      WindowWidth: window.innerWidth,
      WindowHeight: window.innerHeight,
    };
    this.handleResize = this.handleResize.bind(this);
  }
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }
  componentWillUnmount() {
    window.addEventListener("resize", null);
  }
  handleResize(WindowWidth, event) {
    this.setState({
      WindowWidth: window.innerWidth,
      WindowHeight: window.innerHeight,
    });
  }

  back() {
    if (localStorage.getItem("recoveryBack") === "/account") {
      window.location.href = "/account/" + auth.currentUser.uid;
    } else {
      window.location.href = "/login";
    }
  }

  confirmNewPassword() {
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const newPasswordConfirm =
      document.getElementById("newPasswordConfirm").value;
    const errorText = document.getElementById("accountError");
    errorText.style.display = "none";
    errorText.style.marginTop = "5%";

    if (newPassword !== newPasswordConfirm && newPasswordConfirm !== "") {
      errorText.style.display = "block";
      errorText.innerHTML = "Passwords do not match";
      errorText.style.marginTop = "5%";
    } else {
      console.log("ran");
      const cred = EmailAuthProvider.credential(
        auth.currentUser.email,
        oldPassword
      );
      reauthenticateWithCredential(auth.currentUser, cred)
        .then(() => {
          updatePassword(auth.currentUser, newPassword)
            .then(() => {
              if (localStorage.getItem("recoveryBack") === "/account") {
                window.location.href = "/account/" + auth.currentUser.uid;
              } else {
                window.location.href = "/login";
              }
            })
            .catch((error) => {
              const errorCode = error.code;
              if (errorCode === "auth/weak-password") {
                errorText.innerHTML =
                  "Password too weak, please enter atleast 6 characters";
                errorText.style.marginTop = "5%";
                errorText.style.display = "block";
              }
              console.log(errorCode);
            });
        })
        .catch((error) => {
          errorText.style.display = "block";
          errorText.innerHTML = "Current password is incorrect";
          errorText.style.marginTop = "5%";
        });
    }
  }

  render() {
    return (
      <div class="gradient-overlay" id="gradientContainer">
        <NavBar />
        <div className="container__login" id="loginContainer">
          <h1 className="header__login-signup">Recover Password</h1>
          <div className="field container__eplogin-signup">
            <label for="oldPassword" className="label__login-signup">
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
            <label for="newPassword" className="label__login-signup">
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
              <span className="span__login-signup--placeholder">
                New Password
              </span>
            </span>
          </div>
          <div className="field container__eplogin-signup">
            <label for="newPasswordConfirm" className="label__login-signup">
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
          <p id="accountError" className="text__signup--error"></p>
          <button
            onClick={this.confirmNewPassword}
            className="button__recover button__basic"
          >
            Change Password
          </button>
          <button onClick={this.back} className="button__recover button__basic">
            Back
          </button>
        </div>
      </div>
    );
  }
}
