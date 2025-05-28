import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.tsx";
import Button from "../../atoms/Button.tsx";
import Input from "../../atoms/Input.tsx";
import LoadingDots from "../../atoms/Loading.tsx";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../../firebase-config";
import { doc, setDoc } from "firebase/firestore";

interface SignupError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export default function SignUpContainer() {
  const navigate = useNavigate();
  const { register, currentUser } = useAuth();

  useEffect(() => {
    if (localStorage.getItem("IsAuth")) {
      navigate("/");
    }
  }, [navigate]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (name === "") {
      setError("Please enter your name");
      setIsLoading(false);
      return;
    }

    if (email === "") {
      setError("Please enter your email");
      setIsLoading(false);
      return;
    }

    if (password === "") {
      setError("Please enter a password");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await register({
        name,
        email,
        password,
      });
      navigate("/"); // Redirect to home page after successful registration
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        const error = err as SignupError;
        setError(
          error.response?.data?.error || "An error occurred during registration"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50">
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
        px-[2vw]
        py-[2vh]
        min-w-[300px]
        max-w-[500px]
        space-y-4"
      >
        {isLoading && <LoadingDots />}
        <h1 className="text-3xl font-bold text-white text-center mt-2 mb-2">
          Create Account
        </h1>
        <div className="space-y-4">
          <Input
            id="name"
            label="Name"
            variant="login"
            placeholder="Enter your name..."
            autoComplete="none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <Input
            id="email"
            label="Email"
            variant="login"
            placeholder="Enter your email..."
            autoComplete="none"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <Input
            id="password"
            label="Password"
            variant="login"
            placeholder="Enter your password"
            autoComplete="none"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Input
            id="confirmPassword"
            label="Confirm Password"
            variant="login"
            placeholder="Confirm your password"
            autoComplete="none"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            fullWidth
          />
        </div>
        {error && (
          <div className="mt-4 px-4 py-2 bg-red-500/10 rounded-lg">
            <p className="text-sm text-red-500 text-center">{error}</p>
          </div>
        )}
        <div className="space-y-4">
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            fullWidth
            loading={isLoading}
            onClick={(e) => {
              e.preventDefault();
              handleSignup(e as unknown as React.FormEvent<HTMLFormElement>);
            }}
          >
            Sign Up
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="google"
            size="lg"
            fullWidth
            loading={isLoading}
            onClick={handleGoogleSignup}
          >
            Sign up with Google
          </Button>
        </div>

        <div className="text-center mt-4">
          <span className="text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-400">
              Login here
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
