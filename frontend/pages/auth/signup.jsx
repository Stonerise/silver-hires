import React from 'react';
import { useState } from "react";
import Navigation from "../../components/Navigation";
import { fetchAPI } from "../../utils/api";

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
  "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China",
  "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti",
  "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
  "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece",
  "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan",
  "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
  "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
  "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
  "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan",
  "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen",
  "Zambia", "Zimbabwe"
];

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: { city: "", country: "" },
    gender: "",
    dateOfBirth: "",
    isEmployer: false,
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // New state to track success

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    // client side password validation
    if (formData.password.length < 8 || !/\d/.test(formData.password)) {
      setMessage("Password must be at least 8 characters and contain 1 number.");
      return;
    }

    const dataToSubmit = { ...formData };
    delete dataToSubmit.confirmPassword;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true); // Set success state
        setMessage("Sign up is successful! Check your email for confirmation. You can now Sign in.");
      } else {
        setMessage(data.msg || "Error registering.");
      }
    } catch (error) {
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <>
      <header style={{ 
        backgroundColor: "#e6e4e0",
        color: "#2c2c2c",
        padding: "20px 0",
        marginBottom: "40px",
        textAlign: "center"
      }}>
        <h1 className="text-3xl font-medium text-center" style={{ textAlign: "center", width: "100%" }}>Senior Jobs</h1>
        <Navigation />
      </header>

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f6f3",
        padding: "40px 20px"
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          border: "1px solid #eae7e0",
          padding: "40px",
          width: "100%",
          maxWidth: "580px"
        }}>
          {isSuccess ? (
            <div style={{ textAlign: "center" }}>
              <p style={{
                fontSize: "20px",
                color: "#5a7e6a",
                marginBottom: "20px"
              }}>{message}</p>
              <button
                onClick={() => window.location.href = "/auth/signin"}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#5c6ac4",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "18px",
                  cursor: "pointer"
                }}
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <>
              <h2 style={{
                fontSize: "28px",
                fontWeight: "500",
                textAlign: "center",
                marginBottom: "24px",
                color: "#594e45"
              }}>Sign Up</h2>

              {message && <p style={{
                textAlign: "center",
                color: "#5a7e6a",
                marginBottom: "20px",
                fontSize: "18px"
              }}>{message}</p>}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#594e45", fontSize: "18px" }}>Name</label>
                  <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required style={{ width: "100%", padding: "12px 16px", border: "1px solid #eae7e0", borderRadius: "6px", fontSize: "18px", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#594e45", fontSize: "18px" }}>Email</label>
                  <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required style={{ width: "100%", padding: "12px 16px", border: "1px solid #eae7e0", borderRadius: "6px", fontSize: "18px", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#594e45", fontSize: "18px" }}>Password</label>
                  <input type="password" name="password" placeholder="Password (min 6 characters)" onChange={handleChange} required style={{ width: "100%", padding: "12px 16px", border: "1px solid #eae7e0", borderRadius: "6px", fontSize: "18px", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#594e45", fontSize: "18px" }}>Confirm Password</label>
                  <input type="password" name="confirmPassword" placeholder="Confirm your password" onChange={handleChange} required style={{ width: "100%", padding: "12px 16px", border: "1px solid #eae7e0", borderRadius: "6px", fontSize: "18px", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#594e45", fontSize: "18px" }}>Phone Number</label>
                  <input type="text" name="phone" placeholder="Phone with country code" onChange={handleChange} style={{ width: "100%", padding: "12px 16px", border: "1px solid #eae7e0", borderRadius: "6px", fontSize: "18px", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#594e45", fontSize: "18px" }}>City</label>
                  <input type="text" name="location.city" placeholder="Your city" onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })} style={{ width: "100%", padding: "12px 16px", border: "1px solid #eae7e0", borderRadius: "6px", fontSize: "18px", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#594e45", fontSize: "18px" }}>Country</label>
                  <select name="location.country" onChange={(e) => setFormData({ ...formData, location: { ...formData.location, country: e.target.value } })} style={{ width: "100%", padding: "12px 16px", border: "1px solid #eae7e0", borderRadius: "6px", fontSize: "18px", boxSizing: "border-box" }}>
                    <option value="">Select Country</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#594e45", fontSize: "18px" }}>Gender</label>
                  <select name="gender" onChange={handleChange} style={{ width: "100%", padding: "12px 16px", border: "1px solid #eae7e0", borderRadius: "6px", fontSize: "18px", boxSizing: "border-box" }}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#594e45", fontSize: "18px" }}>Date of Birth</label>
                  <input type="date" name="dateOfBirth" onChange={handleChange} style={{ width: "100%", padding: "12px 16px", border: "1px solid #eae7e0", borderRadius: "6px", fontSize: "18px", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#594e45", fontSize: "18px" }}>Account Type</label>
                  <select name="isEmployer" onChange={(e) => setFormData({ ...formData, isEmployer: e.target.value === "true" })} style={{ width: "100%", padding: "12px 16px", border: "1px solid #eae7e0", borderRadius: "6px", fontSize: "18px", boxSizing: "border-box" }}>
                    <option value="false">Job Seeker</option>
                    <option value="true">Employer</option>
                  </select>
                </div>
                <button type="submit" style={{ width: "100%", padding: "14px", backgroundColor: "#5c6ac4", color: "white", border: "none", borderRadius: "6px", fontSize: "18px", fontWeight: "500", cursor: "pointer", transition: "background-color 0.3s", marginTop: "16px" }}>
                  Sign Up
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}