import React from "react";
import { NavBar } from "../components/organisms/navbar/navbar.tsx";
import LoginContainer from "../components/organisms/login/loginContainer.tsx";

export default function LoginScreen() {
  return (
    <div className="gradient-overlay" id="gradientContainer">
      <NavBar />
      <LoginContainer />
    </div>
  );
}
