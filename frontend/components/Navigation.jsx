import React from 'react';
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetchAPI } from "../utils/api";

export default function Navigation() {
  const [userData, setUserData] = useState({
    name: "",
    isLoggedIn: false,
    isEmployer: false
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (token) {
      // Fetch user details using fetchAPI utility
      fetch("/api/auth/user-profile")
      .then((res) => {
        if (!res.ok) {
          // Instead of throwing an error, return a special object
          return { status: "error", message: "Authentication failed" };
        }
        return res.json();
      })
      .then((data) => {
        // Check if i get the error object
        if (data.status === "error") {
          console.log("Token invalid or expired, resetting user state");
          // Clear the invalid token
          localStorage.removeItem("token");
          // Reset user state
          setUserData({
            name: "",
            isLoggedIn: false,
            isEmployer: false
          });
          return; // Exit early
        }
          setUserData({
            name: data.name || "User",
            isLoggedIn: true,
            isEmployer: data.isEmployer || false
          });
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          // Handle authentication error by resetting state
          setUserData({
            name: "",
            isLoggedIn: false,
            isEmployer: false
          });
        });
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUserData({
      name: "",
      isLoggedIn: false,
      isEmployer: false
    });
    router.push("/");
  };

  const handleProfileClick = () => {
    if (userData.isEmployer) {
      router.push("/employer");
    } else {
      router.push("/job-seeker");
    }
  };

  return (
    <nav style={{
      backgroundColor: "#e0cfc3", 
      padding: "10px 0 18px", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center"
    }}>
      <ul style={{
        listStyle: "none",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "25px",
        padding: "0",
        margin: "10px 0 0 0",
        justifyContent: "center"
      }}>
        <li><Link href="/" style={{
          color: "#2c2c2c",
          textDecoration: "none",
          fontSize: "18px",
          padding: "10px 16px",
          borderRadius: "6px",
          transition: "background 0.3s"
        }}>Home</Link></li>
        <li><Link href="/jobs" style={{
          color: "#2c2c2c",
          textDecoration: "none",
          fontSize: "18px",
          padding: "10px 16px",
          borderRadius: "6px",
          transition: "background 0.3s"
        }}>Find Jobs</Link></li>
        <li><Link href="/resources" style={{
          color: "#2c2c2c",
          textDecoration: "none",
          fontSize: "18px",
          padding: "10px 16px",
          borderRadius: "6px",
          transition: "background 0.3s"
        }}>Resources</Link></li>
        <li><Link href="/volunteer" style={{
          color: "#2c2c2c",
          textDecoration: "none",
          fontSize: "18px",
          padding: "10px 16px",
          borderRadius: "6px",
          transition: "background 0.3s"
        }}>Volunteer</Link></li>
        
        {/* Conditional rendering based on auth status */}
        {userData.isLoggedIn ? (
          <>
            <li>
              <span 
                onClick={handleProfileClick} 
                style={{
                  color: "#8f837a",
                  textDecoration: "none",
                  fontSize: "18px",
                  padding: "10px 16px",
                  borderRadius: "6px", 
                  cursor: "pointer",
                  transition: "background 0.3s"
                }}
              >
                Hi, {userData.name}
              </span>
            </li>
            <li>
              <button 
                onClick={handleSignOut} 
                style={{
                  backgroundColor: "#8f837a",
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  border: "none",
                  transition: "background 0.3s"
                }}
              >
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link href="/auth/signup" style={{
              backgroundColor: "#8e5431",
              color: "white",
              padding: "10px 16px",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "18px",
              transition: "background 0.3s"
            }}>Sign Up</Link></li>
            <li><Link href="/auth/signin" style={{
              backgroundColor: "#007fff",
              color: "white",
              padding: "10px 16px",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "18px",
              transition: "background 0.3s"
            }}>Sign In</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}