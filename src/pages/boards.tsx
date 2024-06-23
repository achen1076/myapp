import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/navbar";
import { getAuth } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "C:/Users/achen/myapp/src/firebase-config.js";

export class BoardScreen extends Component {
  createBoard() {
    if (auth.currentUser) {
      const dataId: string = auth.currentUser.uid;
      const docRef = doc(db, dataId, "board");
      setDoc(docRef, {
        // name: name,
        // email: email,
      });
    }
  }

  render() {
    return (
      <div className="gradient-overlay" id="gradientContainer">
        <NavBar />
        <h1 className="header__account header" id="y">
          Boards
        </h1>
        <span>
          <button className="button__basic "></button>
        </span>
      </div>
    );
  }
}
