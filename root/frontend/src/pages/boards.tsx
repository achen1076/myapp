import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/navbar/navbar.tsx";
import { getAuth } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import axios from "axios";

export default class BoardScreen extends Component {
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

  state = { data: [] };

  componentDidMount(): void {
    let data: any;

    axios
      .get("http://localhost:8000")
      .then((response) => {
        data = response.data;
        this.setState({
          data: data,
        });
      })

      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="gradient-overlay" id="gradientContainer">
        <NavBar />
        <h1 className="header__account header" id="y">
          Boards
        </h1>
        {this.state.data.map((output, id) => (
          <div key={id}>
            <h3 className="text__data">{output["employee"]}</h3>
            <h3 className="text__data">{output["department"]}</h3>
          </div>
        ))}
      </div>
    );
  }
}
