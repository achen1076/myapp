import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, provider, db } from "../../../firebase-config.js";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { minWidth } from "../../../utils/constants.tsx";
import setNavbar from "../../molecules/navbar/setNavbar.tsx";
import { AccountAuth, AccountAuthMenu } from "./accountAuth.tsx";

var isAuth = localStorage.getItem("IsAuth");

var displayed = false;

export class NavBar extends Component {
  componentDidMount() {
    const width = window.innerWidth;

    window.addEventListener("resize", () => {
      if (width <= minWidth) {
        setNavbar("fadeOut");
      }
      if (width > minWidth) {
        setNavbar("fadeIn");
      }
    });
  }

  logOut() {
    signOut(auth).then(() => {
      isAuth = "false";
      localStorage.clear();
      window.location.href = "/";
    });
  }
  onMouseEnter() {
    setNavbar("fadeIn");
  }
  onMouseLeave() {
    setNavbar("fadeOut");
  }

  onMenuIconTrigger(event: string) {
    const menuIcon = document.getElementById("menuIcon");
    const navDropdown = document.getElementById("navDropdown");
    let dropdownHeight: string;

    if (window.innerHeight < 800) {
      dropdownHeight = "200px";
    } else {
      dropdownHeight = "20vh";
    }

    if (menuIcon && navDropdown) {
      if (event === "toggle") {
        menuIcon.classList.toggle("open");
        if (navDropdown.style.opacity === "1") {
          navDropdown.style.height = "0vh";
          navDropdown.style.opacity = "0";
          displayed = false;
        } else {
          navDropdown.style.height = dropdownHeight;
          navDropdown.style.opacity = "1";
          displayed = true;
        }
      } else if (event === "add") {
        menuIcon.classList.add("open");
        navDropdown.style.height = dropdownHeight;
        navDropdown.style.opacity = "1";
      } else if (event === "add if displayed" && displayed) {
        menuIcon.classList.add("open");
        navDropdown.style.height = dropdownHeight;
        navDropdown.style.opacity = "1";
      } else if (event === "remove") {
        menuIcon.classList.remove("open");
        navDropdown.style.height = "0vh";
        navDropdown.style.opacity = "0";
        displayed = false;
      } else if (event === "remove and remove displayed") {
        menuIcon.classList.remove("open");
        navDropdown.style.height = "0vh";
        navDropdown.style.opacity = "0";
        displayed = false;
      }
    }
  }

  render() {
    setTimeout(() => {
      setNavbar("fadeIn");
    }, 100);

    return (
      <React.Fragment>
        <div
          className="main__navbar"
          id="navBar"
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <div
            className="site_title__navbar right-border"
            id="titleNavContainer"
          >
            <Link to="/">
              <a className="navbar__item--main">
                <h1 className="nav__title no-highlight" id="mainTitle">
                  Title
                </h1>
              </a>
            </Link>
          </div>
          <div className="container__nav " id="navContainer">
            <Link to="/boards">
              <a className="navbar__item">
                <h1 className="nav__title no-highlight">Data</h1>
              </a>
            </Link>

            <a className="navbar__item">
              <h1 className="nav__title no-highlight">Other</h1>
            </a>
            {isAuth ? (
              <a className="navbar__item" id="">
                <h1 className="nav__title no-highlight" onClick={this.logOut}>
                  Logout
                </h1>
              </a>
            ) : null}
          </div>
          {isAuth ? (
            <div
              className="container__navbar--account"
              id="accountNavContainer"
            >
              <AccountAuth />
            </div>
          ) : (
            <div
              className="container__navbar--account"
              id="accountNavContainer"
            >
              <Link to="/signup">
                <a className="navbar__item--signup">
                  <h1 className="nav__title--signup no-highlight" id="loginNav">
                    Sign Up
                  </h1>
                </a>
              </Link>

              <a className="navbar__item--account">
                <h1 className="nav__title--account no-highlight" id="">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </h1>
              </a>
              <Link to="/login">
                <a className="navbar__item--login">
                  <h1 className="nav__title--login no-highlight" id="loginNav">
                    Login
                  </h1>
                </a>
              </Link>
            </div>
          )}
          <div id="menuContainer">
            <div
              onMouseOver={() => {
                this.onMenuIconTrigger("add if displayed");
              }}
              onMouseLeave={() => {
                this.onMenuIconTrigger("remove");
              }}
              className="container__dropdown"
            >
              <div
                className="icon__menu"
                id="menuIcon"
                onClick={() => {
                  this.onMenuIconTrigger("toggle");
                }}
                onMouseEnter={() => {
                  this.onMenuIconTrigger("add");
                }}
              >
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <ul
              className="dropdown__navbar"
              id="navDropdown"
              onMouseEnter={() => {
                this.onMenuIconTrigger("add");
              }}
              onMouseLeave={() => {
                this.onMenuIconTrigger("remove and remove displayed");
              }}
            >
              <li>
                <Link to="/">
                  <a>Home</a>
                </Link>
              </li>
              <li>
                <Link to="/boards">
                  <a>Data</a>
                </Link>
              </li>
              <li>
                {isAuth ? (
                  <AccountAuthMenu />
                ) : (
                  <Link to="/login">
                    <a>Login</a>
                  </Link>
                )}
              </li>
              <li>
                {isAuth ? (
                  <a onClick={this.logOut}>Logout</a>
                ) : (
                  <Link to="/signup">
                    <a>Sign Up</a>
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
