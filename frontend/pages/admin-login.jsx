import React from 'react';
import { useState } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (res.ok && data.role === "admin") {
      localStorage.setItem("token", data.token);
      router.push("/admin");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f8f6f3" }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: "white", padding: "40px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "24px", textAlign: "center" }}>Admin Login</h2>
        <input type="email" name="email" placeholder="Admin Email" onChange={handleChange} style={{ width: "100%", padding: "12px", marginBottom: "16px", borderRadius: "6px", border: "1px solid #ccc" }} required />
        <input type="password" name="password" placeholder="Admin Password" onChange={handleChange} style={{ width: "100%", padding: "12px", marginBottom: "16px", borderRadius: "6px", border: "1px solid #ccc" }} required />
        <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#5c6ac4", color: "white", borderRadius: "6px", border: "none", cursor: "pointer" }}>Login</button>
      </form>
    </div>
  );
}