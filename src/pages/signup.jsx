import React, { Component } from "react";
import { NavBar } from "../components/navbar";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import {
  auth,
  provider,
  db,
} from "C:/Users/achen/myapp/src/firebase-config.js";
import { useNavigate } from "react-router-dom";

var valid = false;

const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      localStorage.setItem("IsAuth", true);
      const user = auth.currentUser;
      localStorage.setItem("Name", user.displayName);
      const uid = user.uid;
      const docRef = doc(db, uid, "user");
      setDoc(docRef, {
        name: user.displayName,
        email: user.email,
        phone: user.phoneNumber,
      });

      //   const path = "/account/" + uid;
      //   window.location.href = path;
      window.location.href = "/";
    })
    .catch((error) => {
      console.log(error);
    });
};

const createAccount = () => {
  const auth = getAuth();
  const accountError = document.getElementById("accountError");
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      user.displayName = name;
      user.email = email;
      localStorage.setItem("Name", name);
      localStorage.setItem("IsAuth", true);
      const dataId = auth.currentUser.uid;
      const docRef = doc(db, dataId, "user");
      setDoc(docRef, {
        name: name,
        email: email,
      });
      accountError.innerHTML = "";
      accountError.style.marginBottom = "";
      //   const path = "/account/" + user.uid;
      //   window.location.href = path;
      window.location.href = "/";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === "auth/weak-password") {
        accountError.innerHTML =
          "Password too weak, please enter atleast 6 characters";
        accountError.style.marginBottom = "-10%";
        accountError.style.display = "block";
      } else if (errorCode === "auth/email-already-in-use") {
        accountError.innerHTML = "Email already in use";
        accountError.style.marginBottom = "-10%";
        accountError.style.display = "block";
      } else if (errorCode === "auth/invalid-email") {
        accountError.innerHTML = "Invalid email";
        accountError.style.marginBottom = "-10%";
        accountError.style.display = "block";
      }
    });
};

export class SignUpScreen extends Component {
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

  processAccountCreation() {
    if (valid) {
      createAccount();
    }
    console.log(valid);
  }

  onClickGoogle(event) {
    signInWithGoogle();
  }

  confirmPassword() {
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;
    const error = document.getElementById("accountError");

    error.style.display = "none";
    error.style.marginBottom = "";
    valid = true;

    if (password !== confirm && confirm !== "") {
      error.style.display = "block";
      error.innerHTML = "Passwords do not match";
      error.style.marginBottom = "-10%";
      valid = false;
    }
  }

  render() {
    return (
      <div class="gradient-overlay" id="gradientContainer">
        <NavBar />
        <div>
          <div className="container__signup" id="signUpContainer">
            <h1 className="header__login-signup">Create Your Account</h1>
            <div className="field container__eplogin-signup">
              <label for="name" className="label__login-signup">
                Name
              </label>
              <input
                id="name"
                className="input__login-signup"
                placeholder="Enter your name..."
                autoComplete="none"
              />
              <span className="span__login-signup--label" aria-hidden="true">
                <span className="span__login-signup--placeholder">Name</span>
              </span>
            </div>
            <div className="field container__eplogin-signup">
              <label for="email" className="label__login-signup">
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
              <label for="password" className="label__login-signup">
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
                <span className="span__login-signup--placeholder">
                  Password
                </span>
              </span>
            </div>
            <div className="field container__eplogin-signup">
              <label for="confirmPassword" className="label__login-signup">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                className="input__login-signup"
                placeholder=""
                autoComplete="none"
                type="password"
                onKeyUp={this.confirmPassword}
              />
              <span className="span__login-signup--label" aria-hidden="true">
                <span className="span__login-signup--placeholder">
                  Confirm Password
                </span>
              </span>
            </div>
            <p id="accountError" className="text__signup--error"></p>
            <button
              id="signupButton"
              onClick={this.processAccountCreation}
              className="button__signup"
            >
              Create Account
            </button>
            <button
              className="button__google-signup"
              onClick={this.onClickGoogle}
            >
              Sign up with Google
            </button>
            <a href="/login">
              <h3 className="text__login-signup">
                Already have an account? Log in here!
              </h3>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
