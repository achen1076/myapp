import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/navbar";
import Typed from "typed.js";
import { doc } from "firebase/firestore";

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

export class MainScreen extends Component {
  render() {
    function TypedText() {
      const typedElement = React.useRef(null);

      React.useEffect(() => {
        const typed = new Typed(typedElement.current, {
          strings: ["Notes", "Management", "Organization", "Planning"],
          typeSpeed: 50,
          backSpeed: 50,
          loop: true,
        });
      });

      return <span ref={typedElement} />;
    }

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
            <h3 className="main__sub-heading">more text</h3>
          </div>
        </div>
        <script></script>
      </React.Fragment>
    );
  }
}
