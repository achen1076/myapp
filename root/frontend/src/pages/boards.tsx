import React, { Component, useState, useEffect } from "react";
import { NavBar } from "../components/navbar/navbar.tsx";
import axios from "axios";
import api from "../api.js";

function Image() {
  const [image, setImage] = useState([]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    getURL();
  }, []);

  const processData = (data: any) => {
    console.log(data);
  };

  const getURL = () => {
    api
      .get("/app/notes/")
      .then((res) => res.data)
      .then((dat) => {
        processData(dat[0]["result"]);
        setImage(dat);
      })
      .catch((err) => alert(err));
  };

  const apiCall = () => {
    api
      .post("/app/notes/", { user_input: userInput })
      .then((res) => {
        if (res.status === 201) {
          deleteEntry(res.data.id - 1);
        } else alert("Failed to make request.");
      })
      .catch((err) => alert(err));
  };

  const deleteEntry = (id: number) => {
    api
      .delete(`/app/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) getURL();
        else alert("failed to delete");
      })
      .catch((error) => alert(error));
  };

  return (
    <React.Fragment>
      <div className="container__login">
        {image.map((image) => (
          <div key={image["id"]}>
            <p className="header__login-signup">
              {image["id"]}, {image["user_input"]}
            </p>
          </div>
        ))}
        <div className="field container__eplogin-signup">
          <label htmlFor="inpt" className="label__login-signup">
            Input
          </label>
          <input
            id="inpt"
            type="text"
            name="user_input"
            className="input__login-signup"
            placeholder=" "
            onChange={(e) => setUserInput(e.target.value)}
          />
          <span className="span__login-signup--label" aria-hidden="true">
            <span className="span__login-signup--placeholder">Input</span>
          </span>
        </div>

        <button className="button__basic button__login" onClick={apiCall}>
          Enter
        </button>
      </div>
      {/* <img src={source} alt="chart" className="image-test" /> */}
    </React.Fragment>
  );
}

export default class BoardScreen extends Component {
  render() {
    return (
      <div className="gradient-overlay" id="gradientContainer">
        <NavBar />
        <h1 className="header__account header" id="y">
          Sentiment Analysis
        </h1>
        <Image />
      </div>
    );
  }
}
