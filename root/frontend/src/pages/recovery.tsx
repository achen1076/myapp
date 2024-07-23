import React, { Component } from "react";
import { NavBar } from "../components/organisms/navbar/navbar.tsx";
import RecoveryContainer from "../components/organisms/recovery/recoveryContainer.tsx";

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
