import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/navbar/navbar.tsx";
import LoginContainer from "../components/login/loginContainer.tsx";

export default class LoginScreen extends Component {
  render() {
    return (
      <div className="gradient-overlay" id="gradientContainer">
        <NavBar />
        <LoginContainer />
      </div>
    );
  }
}
