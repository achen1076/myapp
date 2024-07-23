import React, { Component } from "react";
import { NavBar } from "../components/organisms/navbar/navbar.tsx";
import SignUpContainer from "../components/organisms/signup/signupContainer.tsx";

export default class SignUpScreen extends Component {
  render() {
    return (
      <div className="gradient-overlay" id="gradientContainer">
        <NavBar />
        <SignUpContainer />
      </div>
    );
  }
}
