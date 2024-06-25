import React, { Component } from "react";
import { NavBar } from "../components/navbar/navbar.tsx";
import RecoveryContainer from "../components/recovery/recoveryContainer.tsx";

export default class RecoveryScreen extends Component {
  render() {
    return (
      <div className="gradient-overlay" id="gradientContainer">
        <NavBar />
        <RecoveryContainer />
      </div>
    );
  }
}
