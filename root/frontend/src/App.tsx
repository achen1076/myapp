import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  IndexPage,
  LoginPage,
  SignUpPage,
  AccountPage,
  RecoveryPage,
  BoardsPage,
} from "./pages.js";
import "./css/global.css";
import "./css/main.css";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/recovery" element={<RecoveryPage />} />
      <Route
        path="/boards"
        element={
          <ProtectedRoute>
            <BoardsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/account/:userId" element={<AccountPage />} />
    </Routes>
  );
}
