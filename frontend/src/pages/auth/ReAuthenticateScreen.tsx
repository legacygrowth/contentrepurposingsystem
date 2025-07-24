import React from "react";
import { Link } from "react-router-dom";

const ReAuthenticateScreen: React.FC = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h1 style={{ fontSize: "24px", color: "#333" }}>Token is expired.</h1>
      <p style={{ fontSize: "18px", color: "#555", margin: "1rem 0" }}>
        Please re-authenticate to continue.
      </p>

      {/* Styled Link as Button */}
      <Link
        to="/auth/login"
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#fff", 
          color: "#000", 
          border: "1px solid #ccc", 
          borderRadius: "5px",
          cursor: "pointer",
          textDecoration: "none", 
          marginTop: "10px",
          fontWeight: "bold",
        }}
      >
        Go to Login
      </Link>
    </div>
  );
};

export default ReAuthenticateScreen;
