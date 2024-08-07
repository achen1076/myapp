import React, { Component, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/organisms/navbar/navbar.tsx";
import { minWidth } from "../utils/constants.tsx";
import NameText from "../components/molecules/account/nameText.tsx";
import PasswordReset from "../components/molecules/account/passwordReset.tsx";
import LoadingDots from "../components/atoms/Loading.tsx";

const onResize = () => {
  const width = window.innerWidth;
  const passwordSpan = document.getElementById("spanPassword");
  if (passwordSpan) {
    if (width <= minWidth) {
      passwordSpan.style.display = "block";
    }
    if (width > minWidth) {
      passwordSpan.style.display = "inline-flex";
    }
  }
};

export default class AccountScreen extends Component {
  componentDidMount() {
    window.addEventListener("resize", () => {
      onResize();
    });
  }

  render() {
    return (
      <div className="gradient-overlay" id="gradientContainer">
        <NavBar />
        <div className="container__welcome blur-on-load" id="welcomeContainer">
          <NameText />
        </div>
        <div
          className="container__account blur-on-load"
          id="accountSettingContainer"
        >
          <h1 className="sub-header__account">Password Section</h1>
          <hr className="line__white" />
          <PasswordReset />
        </div>
      </div>
    );
  }
}
