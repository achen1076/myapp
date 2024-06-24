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
import SignUpContainer from "../components/signup/signupContainer.tsx";

export class SignUpScreen extends Component {
  render() {
    return (
      <div className="gradient-overlay" id="gradientContainer">
        <NavBar />
        <SignUpContainer />
      </div>
    );
  }
}
