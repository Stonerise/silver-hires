import React from 'react';
import { useState } from "react";
import { useRouter } from "next/router";
import Navigation from "../../components/Navigation";
import { fetchAPI } from "../../utils/api";

export default function SignIn() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setIsLoading(true);
  
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      console.log("Login Response:", res.status, data);
  
      if (res.ok) {
        setMessage("Login successful!");
        localStorage.setItem("token", data.token);
        await new Promise(resolve => setTimeout(resolve, 0));  // ensure token is set
        console.log("Token Stored:", localStorage.getItem("token"));
        
        // Get user details to determine redirect
      const userRes = await fetch("/api/auth/user-profile", {
        headers: {
          Authorization: `Bearer ${data.token}`
        }
      });
      
        const userData = await userRes.json();
        console.log("User Profile Response:", userRes.status, userData);
        // Redirect based on user type
      if (userRes.ok) {
        if (userData.isEmployer) {
          console.log("Redirecting to /employer");
          window.location.href = "/employer"; // Fallback
        } else {
          console.log("Redirecting to /job-seeker");
          window.location.href = "/job-seeker"; // Fallback
        }
      } else {
        console.error("User profile fetch failed:", userData);
        window.location.href = "/"; // Default redirect to home if can't determine user type
      }
    } else {
      setMessage(data.msg || "Invalid credentials.");
    }
  } catch (error) {
    setMessage("Server error. Please try again later.");
    console.error("Login error:", error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f6f3]">
      <header style={{ 
        backgroundColor: "#e6e4e0",
        color: "#2c2c2c",
        padding: "20px 0",
        textAlign: "center"
      }}>
        
        <h1 className="text-3xl font-medium text-center" style={{ textAlign: "center", width: "100%" }}>Senior Jobs</h1>
        <Navigation />
        </header>

        <div className="flex-grow flex items-center justify-center py-12" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>        <div style={{
      backgroundColor: "#fff",
      padding: "40px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      border: "1px solid #eae7e0",
      width: "420px",
      maxWidth: "90%"
    }}>
      <h2 style={{ 
        fontSize: "28px", 
        fontWeight: "500", 
        marginBottom: "24px",
        color: "#594e45",
        textAlign: "center"
      }}>Sign In</h2>

      {message && <p style={{ 
        color: "#5a7e6a", 
        marginBottom: "16px", 
        textAlign: "center",
        fontSize: "18px"
      }}>{message}</p>}

<form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: "18px",
            borderRadius: "6px",
            border: "1px solid #eae7e0",
            marginBottom: "16px",
            boxSizing: "border-box"
          }}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 8 characters including 1 number)"
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: "18px",
            borderRadius: "6px",
            border: "1px solid #eae7e0",
            marginBottom: "24px",
            boxSizing: "border-box"
          }}
          onChange={handleChange}
          required
        />
        <button type="submit" style={{
          width: "100%",
          backgroundColor: "#5c6ac4",
          color: "white",
          padding: "12px 16px",
          fontSize: "18px", 
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.3s"
        }}>
          Sign In
        </button>
      </form>
    </div>
  </div>
</div>
  );
}
