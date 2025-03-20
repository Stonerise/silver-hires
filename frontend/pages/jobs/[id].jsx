import React from 'react';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";

export default function JobDetails() {
  const router = useRouter();
  const { jobId } = router.query;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: null,
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!job) return;

    const formDataToSend = new FormData();
    formDataToSend.append("applicantName", formData.name);
    formDataToSend.append("applicantEmail", formData.email);
    formDataToSend.append("applicantPhone", formData.phone);
    formDataToSend.append("resume", formData.resume);
    formDataToSend.append("coverLetter", formData.coverLetter);
    formDataToSend.append("jobId", job._id);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formDataToSend,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Application submitted successfully!");
        setShowPopup(false);
        setFormData({ name: "", email: "", phone: "", resume: null, coverLetter: null });
      } else {
        alert(result.message || "Failed to submit application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (jobId) {
      const token = localStorage.getItem("token");
      fetch(`/api/jobs/${jobId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          setJob(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching job details:", error);
          setLoading(false);
        });
    }
  }, [jobId]);

  if (loading) {
    return (
      <div>
  <header style={{ 
    backgroundColor: "#e6e4e0",
    color: "#2c2c2c",
    padding: "20px 0 0",
    marginBottom: "40px"
  }}>
    <h1 className="text-3xl font-medium text-center">Senior Jobs</h1>
    <Navigation />
  </header>
  <p style={{
          textAlign: "center",
          fontSize: "18px",
          marginTop: "40px"
        }}>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div>
        <header style={{ 
          backgroundColor: "#e6e4e0",
          color: "#2c2c2c",
          padding: "20px 0 0",
          marginBottom: "40px"
        }}>
          <h1 className="text-3xl font-medium text-center">Senior Jobs</h1>
          <Navigation />
        </header>
        <p style={{
          textAlign: "center",
          fontSize: "18px",
          marginTop: "40px"
        }}>Job not found.</p>
      </div>
    );
  }

  return (
    <div>
      <header style={{ 
        backgroundColor: "#e6e4e0",
        color: "#2c2c2c",
        padding: "20px 0 0",
        marginBottom: "40px"
      }}>
        <h1 className="text-3xl font-medium text-center">Senior Jobs</h1>
        <Navigation />
      </header>
      
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "0 24px"
      }}>
        <h1 style={{
          fontSize: "32px",
          fontWeight: "500",
          marginBottom: "16px",
          color: "#594e45"
        }}>{job.title}</h1>

        <p style={{
          fontSize: "20px",
          color: "#594e45",
          marginBottom: "24px"
        }}>{job.location}</p>

        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #eae7e0",
          borderRadius: "8px",
          padding: "32px",
          marginBottom: "32px",
          fontSize: "18px",
          lineHeight: "1.6",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}>
          <p><strong>Description:</strong> {job.description}</p>
          <p><strong>Qualifications:</strong> {job.qualifications}</p>
          <p><strong>Salary:</strong> {job.salary}</p>
        </div>

        <button style={{
          backgroundColor: "#5a7e6a",
          color: "white",
          padding: "14px 28px",
          fontSize: "18px",
          fontWeight: "500",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.3s",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}
        onClick={() => setShowPopup(true)}>
          Apply for this Job
          </button>
      </div>

        {/* Add right before the closing div of the return statement */}
{showPopup && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}
  >
    <div
      style={{
        backgroundColor: "#fff",
        padding: "32px",
        borderRadius: "8px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
        width: "460px",
        maxWidth: "90%"
      }}
    >
      <h2 style={{ 
        textAlign: "center", 
        marginBottom: "24px",
        fontSize: "24px",
        fontWeight: "500",
        color: "#594e45"
      }}>
        Apply for {job.title}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Form inputs with updated styles */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px",
            fontSize: "18px",
            color: "#594e45"
          }}>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #eae7e0",
              borderRadius: "6px",
              fontSize: "18px"
            }}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Address */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px",
            fontSize: "18px",
            color: "#594e45"
          }}>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #eae7e0",
              borderRadius: "6px",
              fontSize: "18px"
            }}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone Number */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px",
            fontSize: "18px",
            color: "#594e45"
          }}>Phone Number</label>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #eae7e0",
              borderRadius: "6px",
              fontSize: "18px"
            }}
            onChange={handleChange}
            required
          />
        </div>

        {/* Resume Upload */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px",
            fontSize: "18px",
            color: "#594e45"
          }}>Resume (PDF Only)</label>
          <input
            type="file"
            name="resume"
            accept=".pdf"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #eae7e0",
              borderRadius: "6px",
              fontSize: "18px"
            }}
            onChange={handleFileChange}
            required
          />
        </div>

        {/* Cover Letter Upload */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px",
            fontSize: "18px",
            color: "#594e45"
          }}>Cover Letter (PDF Only)</label>
          <input
            type="file"
            name="coverLetter"
            accept=".pdf"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #eae7e0",
              borderRadius: "6px",
              fontSize: "18px"
            }}
            onChange={handleFileChange}
            required
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
          <button
            type="button"
            style={{
              backgroundColor: "#eae7e0",
              color: "#594e45",
              padding: "12px 20px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              width: "45%",
              fontSize: "18px"
            }}
            onClick={() => setShowPopup(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              backgroundColor: "#5a7e6a",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              width: "45%",
              fontSize: "18px"
            }}
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}
