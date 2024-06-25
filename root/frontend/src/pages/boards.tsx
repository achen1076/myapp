import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/navbar/navbar.tsx";
import { getAuth } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import axios from "axios";

export default class BoardScreen extends Component {
  render() {
    return (
      <div className="gradient-overlay" id="gradientContainer">
        <NavBar />
        <h1 className="header__account header" id="y">
          Boards
        </h1>
      </div>
    );
  }
}
