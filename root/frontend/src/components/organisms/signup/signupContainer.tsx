import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.tsx";
import LoadingDots from "../../atoms/Loading.tsx";
import Input from "../../atoms/Input.tsx";
import Button from "../../atoms/Button.tsx";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase-config";

export default function SignUpContainer() {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate form
    if (!name) {
      setError("Please enter your name");
      setIsLoading(false);
      return;
    }

    if (!email) {
      setError("Please enter your email");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter a password");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    try {
      await register({ name, email, password });
      navigate("/");
    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.code === "auth/weak-password") {
        setError("Password too weak, please enter at least 6 characters");
      } else if (error.code === "auth/email-already-in-use") {
        setError("Email already in use");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email");
      } else {
        setError("An error occurred during registration");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      setError("");

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        // Store user data in localStorage
        localStorage.setItem("IsAuth", JSON.stringify(true));
        localStorage.setItem("Name", user.displayName || "");
        localStorage.setItem("UID", JSON.stringify(user.uid));

        // Store additional user data in Firestore
        const docRef = doc(db, user.uid, "user");
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          createdAt: new Date().toISOString(),
        });

        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("Google signup error:", error);
      if (error.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed");
      } else {
        setError("Failed to sign in with Google");
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
        Create your account
      </h1>
      <div className="w-full max-w-md space-y-8">
        <form onSubmit={handleSignup} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              label="Name"
              id="name"
              value={name}
              variant="login"
              placeholder="Enter your name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              required
            />

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
              minLength={6}
            />

            <Input
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              variant="login"
              placeholder="Confirm your password"
              value={passwordConfirm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPasswordConfirm(e.target.value)
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
              Create Account
            </Button>

            <Button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isLoading}
              fullWidth
              variant="secondary"
            >
              Sign up with Google
            </Button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Already have an account? Log in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
