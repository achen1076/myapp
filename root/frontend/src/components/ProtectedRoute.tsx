import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api.tsx";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../utils/constants.tsx";
import React, { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface JWTPayload {
  exp?: number;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [IsAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const response = await api.post("/app/token/refresh/", {
        refresh: refreshToken,
      });
      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      setIsAuthorized(false);
      console.log(error);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const decoded = jwtDecode<JWTPayload>(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;
    if (tokenExpiration) {
      if (tokenExpiration < now) {
        await refreshToken();
      } else {
        setIsAuthorized(true);
      }
    }
  };

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  if (IsAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return IsAuthorized ? <>{children}</> : <Navigate to="/login" />;
}

export default ProtectedRoute;
