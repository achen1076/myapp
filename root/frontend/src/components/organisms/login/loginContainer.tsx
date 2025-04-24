import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase-config";
import LoadingDots from "../../atoms/Loading.tsx";
import Input from "../../atoms/Input.tsx";
import Button from "../../atoms/Button.tsx";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../utils/constants.tsx";
import api from "../../../api.tsx";
import { useAuth } from "../../../contexts/AuthContext.tsx";
import { User } from "firebase/auth";

interface LoginError {
  error?: string;
}

export default function LoginContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const setCurrentUser = async (user: User | null) => {
    if (user && localStorage.getItem("IsAuth")) {
      const docRef = doc(db, user.uid, "user");
      const docSnap = await getDoc(docRef);
      while (!docSnap.exists()) {}
      if (docSnap.exists()) {
        localStorage.setItem("UID", JSON.stringify(user.uid));
        localStorage.setItem("Name", docSnap.data().name);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");
      window.location.href = "/";
    } catch (error: any) {
      console.error("Google login error:", error);
      setError("Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!email) {
        setError("Please enter your email");
        return;
      }

      if (!password) {
        setError("Please enter your password");
        return;
      }

      await signInWithEmailAndPassword(auth, email, password).then(
        async (userCredential) => {
          const user = userCredential.user;
          setIsLoading(true);
          localStorage.setItem("IsAuth", JSON.stringify(true));
          await setCurrentUser(user);
        }
      );

      setIsLoading(false);
      window.location.href = "/";
    } catch (error: any) {
      console.error("Email login error:", error);
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setError("Invalid email or password");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else {
        setError("An error occurred during login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-1/3
      h-auto
      bg-gray-900
      absolute
      left-1/2
      top-[max(50%,_300px)]
      -translate-x-1/2
      -translate-y-[30%]
      rounded-[calc((1.5vw+1.5vh)/2)]
      border-[0.3em] border-white/5
      inline-block
      px-[2vw]
      py-[2vh]
      min-w-[300px]
      max-w-[500px]
      min-h-[600px]
      overflow-hidden"
    >
      {isLoading && <LoadingDots />}
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        Welcome Back
      </h1>

      <form onSubmit={handleEmailLogin} className="space-y-6">
        <div className="space-y-4">
          <Input
            label="Email"
            id="email"
            type="email"
            value={email}
            variant="login"
            placeholder="Enter your email"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />

          <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            variant="login"
            placeholder="Enter your password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            disabled={isLoading}
            fullWidth
            variant="secondary"
          >
            Login
          </Button>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            fullWidth
            variant="secondary"
          >
            Sign in with Google
          </Button>
        </div>

        <div className="text-center">
          <Link
            to="/signup"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Need an account? Sign up here
          </Link>
        </div>
      </form>
    </div>
  );
}
