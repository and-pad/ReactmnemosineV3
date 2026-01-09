//import React from "react";
import { Route, Navigate } from "react-router-dom";
import Login from "../components/LoginComponents/Login"; // tu componente real

export function AuthRoutes({ handleLoginCallback, accessToken, setAccessToken }) {
  return (
    <>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={
          <Login
            onLogin={handleLoginCallback}
            setAccessToken={setAccessToken}
            accessToken={accessToken}
          />
        }
      />
    </>
  );
}