import React from 'react';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navigation from "../components/Navigation";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: null,
  });
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isEmployerFilter, setIsEmployerFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setFilteredJobs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (search) {
      filtered = filtered.filter((job) =>
        job.isEmployer
          ? job.title.toLowerCase().includes(search.toLowerCase()) ||
            job.location.toLowerCase().includes(search.toLowerCase())
          : job.subject.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((job) => job.type === typeFilter || job.preferredType === typeFilter);
    }

    if (isEmployerFilter !== "") {
      filtered = filtered.filter((job) => job.isEmployer.toString() === isEmployerFilter);
    }

    setFilteredJobs(filtered);
  }, [search, typeFilter, isEmployerFilter, jobs]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;
  
    const formDataToSend = new FormData();
    formDataToSend.append("applicantName", formData.name);
    formDataToSend.append("applicantEmail", formData.email);
    formDataToSend.append("applicantPhone", formData.phone);
    formDataToSend.append("resume", formData.resume);
    formDataToSend.append("coverLetter", formData.coverLetter);
    formDataToSend.append("jobId", selectedJob._id);
  
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
      } else {
        alert(result.message || "Failed to submit application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred. Please try again.");
    }
  };  

  return (
    <div className="container mt-5">
      <header style={{ 
        backgroundColor: "#e6e4e0",
        color: "#2c2c2c",
        padding: "24px 0 0",
        marginBottom: "40px",
        textAlign: "center"
      }}>
        <div className="container mx-auto flex justify-center items-center flex-col">
      <h1 className="text-3xl font-medium mb-2">Senior Jobs</h1>
        <p style={{
          fontSize: "1.125rem",
          marginTop: "4px",
          textAlign: "center",
          marginBottom: "16px"
        }}>
          Welcome to Senior Jobs, a platform for senior citizens and retirees to find employment opportunities
          that value your experience and wisdom.
        </p>
      <Navigation />
      </div>
      </header>

      <h1 className="text-center" style={{ textAlign: "center", marginBottom: "32px", fontSize: "28px" }}>Job Listings</h1>

      {/* 🔍 Search & Filters */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "16px",
        marginBottom: "32px",
        maxWidth: "1000px",
        margin: "0 auto 32px"
      }}>
  <div style={{ flex: "1", minWidth: "250px" }}>
    
    <input
      type="text"
      placeholder="Search jobs..."
      style={{
        width: "100%",
        padding: "12px 16px",
        fontSize: "18px",
        borderRadius: "6px",
        border: "1px solid #eae7e0"
      }}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  <div style={{ flex: "1", minWidth: "250px" }}>
    <select 
      style={{
        width: "100%",
        padding: "12px 16px",
        fontSize: "18px",
        borderRadius: "6px",
        border: "1px solid #eae7e0"
      }}
      value={typeFilter} 
      onChange={(e) => setTypeFilter(e.target.value)}
    >
      <option value="">All Types</option>
      <option value="Full-time">Full-time</option>
      <option value="Part-time">Part-time</option>
      <option value="Remote">Remote</option>
    </select>
  </div>

  <div style={{ flex: "1", minWidth: "250px" }}>
    <select 
      style={{
        width: "100%",
        padding: "12px 16px",
        fontSize: "18px",
        borderRadius: "6px",
        border: "1px solid #eae7e0"
      }}
      value={isEmployerFilter} 
      onChange={(e) => setIsEmployerFilter(e.target.value)}
    >
      <option value="">All</option>
      <option value="true">Employer Jobs</option>
      <option value="false">Job Seeker Posts</option>
    </select>
  </div>
</div>

{/* Update the job cards */}
<div style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "24px",
  maxWidth: "1200px",
  margin: "0 auto"
}}>
  {filteredJobs.map((job) => (
    <div key={job._id} style={{
      backgroundColor: "#fff",
      borderRadius: "8px",
      border: "1px solid #eae7e0",
      padding: "24px",
      paddingBottom: "32px",
      transition: "transform 0.2s, box-shadow 0.2s",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    }}>
      <h3 style={{
        fontSize: "22px",
        fontWeight: "500",
        marginBottom: "12px",
        color: "#2c2520",
        cursor: "pointer"
      }} onClick={() => router.push(`/jobs/${job._id}`)}>
        {job.isEmployer ? job.title : job.subject}
      </h3>
      <h4 style={{ 
        fontSize: "18px", 
        color: "#594e45",
        marginBottom: "16px"
      }}>{job.location}</h4>
      <p style={{ 
        fontSize: "18px",
        marginBottom: "16px",
        lineHeight: "1.6",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }}>{job.isEmployer ? job.description : job.whatICanDoForYou}</p>
      <p style={{ 
        fontSize: "18px",
        fontWeight: "500",
        marginBottom: "20px",
        color: "#5a7e6a"
      }}>
        <strong>{job.isEmployer ? `Salary: ${job.salary}` : `Preferred Type: ${job.preferredType}`}</strong>
      </p>

      {job.isEmployer && (
        <button
          style={{
            backgroundColor: "#5c6ac4",
            color: "white",
            padding: "10px 20px",
            fontSize: "18px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            width: "100%",
            transition: "background-color 0.3s"
          }}
          onClick={() => {
            setSelectedJob(job);
            setShowPopup(true);
          }}
        >
          Apply
        </button>
      )}
    </div>
  ))}
</div>
              

{/* Job Application Popup */}
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
      Apply for {selectedJob?.title}
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
          onChange={handleChange}
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
          onChange={handleChange}
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
