import React, { Component, useState, useEffect } from "react";
import { NavBar } from "../components/organisms/navbar/navbar.tsx";
import Typed from "typed.js";
import Button from "../components/atoms/Button.tsx";
import Textbox from "../components/atoms/Textbox.tsx";

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("mousemove", function (e) {
    var x: number;
    var y: number;

    if (window.innerHeight < 800) {
      x = ((e.clientX + window.scrollX) / window.innerWidth) * 100;
      y = ((e.clientY + window.scrollY) / 800) * 100;
    } else {
      x = ((e.clientX + window.scrollX) / window.innerWidth) * 100;
      y = ((e.clientY + window.scrollY) / window.innerHeight) * 100;
    }
    const container = document.getElementById("gradientContainer");
    if (container) {
      container.style.setProperty("--mouse-x", x + "%");
      container.style.setProperty("--mouse-y", y + "%");
    }
  });
});

function TypedText() {
  const typedElement = React.useRef(null);

  React.useEffect(() => {
    const typed = new Typed(typedElement.current, {
      strings: ["Notes", "Management", "Organization", "Planning"],
      typeSpeed: 50,
      backSpeed: 50,
      loop: true,
      showCursor: false,
    });
  });

  return <span ref={typedElement} id="typed" />;
}

export default class MainScreen extends Component {
  handleTestClick = async () => {
    try {
      const response = await fetch("http://localhost:8000/test");
      const data = await response.json();
      console.log("Test response:", data);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error calling test endpoint:", error);
      alert("Error calling test endpoint");
    }
  };

  handleInsertData = async () => {
    try {
      const testUser = {
        name: `User ${Date.now()}`,
        username: `user_${Date.now()}`,
        email: `user_${Date.now()}@example.com`,
        password: "testpass123",
      };

      const response = await fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testUser),
      });

      const data = await response.json();
      console.log("Insert response:", data);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error inserting data:", error);
      alert("Error inserting data");
    }
  };

  handleGetData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/users");
      const data = await response.json();
      console.log("Users data:", data);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error getting data:", error);
      alert("Error getting data");
    }
  };

  handleClearData = async () => {
    if (window.confirm("Are you sure you want to delete all users?")) {
      try {
        const response = await fetch("http://localhost:8000/api/users", {
          method: "DELETE",
        });
        const data = await response.json();
        console.log("Clear response:", data);
        alert(JSON.stringify(data, null, 2));
      } catch (error) {
        console.error("Error clearing data:", error);
        alert("Error clearing data");
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="gradient-overlay" id="gradientContainer">
          <NavBar />
          <div className="main__title-container">
            <h1 className="main__main-heading extra-margin-bottom">
              The Best <br />
              <TypedText /> <br />
              Tool
            </h1>
          </div>
          <div
            className="main__button-container"
            style={{
              position: "relative",
              display: "flex",
              gap: "1rem",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "1rem" }}>
              <Button
                variant="primary"
                size="lg"
                onClick={this.handleTestClick}
              >
                Test Connection
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={this.handleInsertData}
              >
                Insert Test User
              </Button>
              <Button variant="primary" size="lg" onClick={this.handleGetData}>
                Get All Users
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={this.handleClearData}
              >
                Clear Database
              </Button>
            </div>
            <Textbox />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
