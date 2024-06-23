import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setDoc, doc, getDoc } from "firebase/firestore";
import {
  auth,
  provider,
  db,
} from "C:/Users/achen/myapp/src/firebase-config.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { minWidth } from "../utils/constants.tsx";

var isAuth = localStorage.getItem("IsAuth");

var displayed = false;

const setNavbar = (event) => {
  const width = window.innerWidth;
  const navContainer = document.getElementById("navContainer");
  const accountNavContainer = document.getElementById("accountNavContainer");
  const menuContainer = document.getElementById("menuContainer");
  const menuIcon = document.getElementById("menuIcon");
  const titleNavContainer = document.getElementById("titleNavContainer");
  if (width <= minWidth) {
    navContainer.style.display = "none";
    accountNavContainer.style.display = "none";
    menuContainer.style.display = "inline-block";
    menuIcon.style.display = "inline-block";
    titleNavContainer.style.width = "80vw";
    navContainer.style.animation = `0.5s ${event} forwards`;
  }
  if (width > minWidth) {
    navContainer.style.display = "block";
    accountNavContainer.style.display = "block";
    menuContainer.style.display = "none";
    navContainer.style.animation = `0.5s ${event} forwards`;
    menuIcon.style.display = "none";
    titleNavContainer.style.width = "20vw";
  }
};

const setData = async (user) => {
  if (user) {
    const currentUser = auth.currentUser;
    const docRef = doc(db, currentUser.uid, "user");
    const docSnap = await getDoc(docRef);
    while (!docSnap.exists()) {}
    if (localStorage.getItem("IsAuth")) {
      if (docSnap.exists()) {
        const uid = currentUser.uid;
        const path = "/account/" + uid;
        document.getElementById("accountLink").href = path;
        document.getElementById("accountMenuLink").href = path;
        document.getElementById("accountNavTitle").innerHTML =
          docSnap.data().name;
      }
    }
  }
  setNavbar("fadeIn");
};

const loadData = async () => {
  onAuthStateChanged(auth, (user) => {
    setData(user);
  });
};

loadData();

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
      isAuth = false;
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

  onMenuIconTrigger(event) {
    const menuIcon = document.getElementById("menuIcon");
    const navDropdown = document.getElementById("navDropdown");
    let dropdownHeight;

    if (window.innerHeight < 800) {
      dropdownHeight = "200px";
    } else {
      dropdownHeight = "20vh";
    }

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

  render() {
    return (
      <React.Fragment>
        <div
          className="main__navbar"
          id="navBar"
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <div className="site_title__navbar" id="titleNavContainer">
            <a className="navbar__item--main" href="/">
              <h1 className="nav__title no-highlight" id="mainTitle">
                Title
              </h1>
            </a>
          </div>
          <div className="container__nav left-border" id="navContainer">
            <a className="navbar__item" href="/boards">
              <h1 className="nav__title no-highlight">Boards</h1>
            </a>
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
              <a className="navbar__item--account" id="accountLink">
                <h1
                  className="nav__title--account no-highlight"
                  id="accountNavTitle"
                ></h1>
              </a>
            </div>
          ) : (
            <div
              className="container__navbar--account"
              id="accountNavContainer"
            >
              <a className="navbar__item--signup" href="/signup">
                <h1 className="nav__title--signup no-highlight" id="loginNav">
                  Sign Up
                </h1>
              </a>
              <a className="navbar__item--account">
                <h1 className="nav__title--account no-highlight" id="">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </h1>
              </a>
              <a className="navbar__item--login" href="/login">
                <h1 className="nav__title--login no-highlight" id="loginNav">
                  Login
                </h1>
              </a>
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
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/boards">Boards</a>
              </li>
              <li>
                {isAuth ? (
                  <a href="" id="accountMenuLink">
                    Account
                  </a>
                ) : (
                  <a href="/login">Login</a>
                )}
              </li>
              <li>
                {isAuth ? (
                  <a onClick={this.logOut}>Logout</a>
                ) : (
                  <a href="/singup">Sign Up</a>
                )}
              </li>
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
