import React, { useState } from "react";
import "./css/global.css";
import "./css/main.css";
import { MainScreen } from "./pages/main.tsx";
import { LoginScreen } from "./pages/login.tsx";
import { SignUpScreen } from "./pages/signup";
import { AccountScreen } from "./pages/account.tsx";
import { RecoveryScreen } from "./pages/recovery";
import { BoardScreen } from "./pages/boards.tsx";

export function IndexPage() {
  return (
    <React.Fragment>
      <MainScreen />
    </React.Fragment>
  );
}

export function LoginPage() {
  return (
    <React.Fragment>
      <LoginScreen />
    </React.Fragment>
  );
}

export function SignUpPage() {
  return (
    <React.Fragment>
      <SignUpScreen />
    </React.Fragment>
  );
}

export function AccountPage() {
  return (
    <React.Fragment>
      <AccountScreen />
    </React.Fragment>
  );
}

export function RecoveryPage() {
  return (
    <React.Fragment>
      <RecoveryScreen />
    </React.Fragment>
  );
}
export function BoardsPage() {
  return (
    <React.Fragment>
      <BoardScreen />
    </React.Fragment>
  );
}
