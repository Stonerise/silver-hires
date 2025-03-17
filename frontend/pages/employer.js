import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navigation from "../components/Navigation";

export default function EmployerDashboard() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", description: "", qualifications: "", location: "", salary: "" });

  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [userProfile, setUserProfile] = useState({ username: "", photoUrl: "" }); // Replace username state

useEffect(() => {
  if (!token) {
    router.push("/auth/signin");
    return;
  }

  const fetchProfileAndData = async () => {
    try {
      // Fetch employer profile
      const profileRes = await fetch("/api/auth/employer-profile", {   // changed to /api/
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!profileRes.ok) {
        if (profileRes.status === 401) {
          localStorage.removeItem("token");
          router.push("/auth/signin");
          return;
        }
        throw new Error("Failed to fetch profile");
      }
      const profileData = await profileRes.json();
      setUserProfile({ username: profileData.username || " Employer", photoUrl: profileData.photoUrl || "" });

      // Fetch job listings
      const jobsRes = await fetch("/api/jobs/employer-jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!jobsRes.ok) throw new Error(`Error: ${jobsRes.status}`);
      const jobsData = await jobsRes.json();
      setJobs(Array.isArray(jobsData) ? jobsData : []);

      // Fetch applications
      const appsRes = await fetch("/api/applications/employer/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!appsRes.ok) throw new Error(`Error: ${appsRes.status}`);
      const appsData = await appsRes.json();
      setApplications(Array.isArray(appsData) ? appsData : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setJobs([]);
      setApplications([]);
      setLoading(false);
    }
  };

  fetchProfileAndData();
}, [router, token]);

  // Calculate applications per job
  // Update the jobApplicationCount calculation
const jobApplicationCount = Array.isArray(jobs) 
? jobs.map((job) => ({
    ...job,
    applicationsReceived: applications.filter((app) => app.jobId === job._id).length,
  }))
: [];

  // user photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('photo', file);
  
    try {
      const res = await fetch('/api/auth/upload-photo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        // Refetch profile to update photoUrl
        const profileRes = await fetch("/api/auth/employer-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();
        setUserProfile({ username: profileData.username || "Employer", photoUrl: profileData.photoUrl || "" });
        alert('Photo uploaded successfully!');
      } else {
        alert('Failed to upload photo.');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Handle job form input
  const handleInputChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  // Submit new job posting
const handleJobSubmit = (e) => {
  e.preventDefault();
  
  // Ensure all required fields are present
  if (!newJob.title || !newJob.location || !newJob.salary || !newJob.description || !newJob.qualifications) {
    alert("Please fill in all required fields");
    return;
  }
  
  fetch("/api/jobs/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newJob),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      // Create a new array with the new job
      const updatedJobs = [...jobs, data];
      setJobs(updatedJobs);
      
      // Reset form fields
      setNewJob({ title: "", description: "", qualifications: "", location: "", salary: "" });
      setShowJobForm(false); // Close form
    })
    .catch((error) => {
      console.error("Error posting job:", error);
      alert("Error creating job. Please try again.");
    });
};

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <header style={{ 
        backgroundColor: "#594e45",
        color: "white",
        padding: "20px 0",
        marginBottom: "30px",
        textAlign: "center"
      }}>
      <h1 className="text-3xl font-medium text-center">Senior Jobs</h1>
      <Navigation />
      </header>

      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Employer Dashboard</h1>
      <p style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>
        Hello, <strong>{username}</strong>! Welcome to your dashboard. Here you can see what jobs you have posted, how many applications you have received, and you can also post new jobs.
      </p>

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
        <p><strong>Total Job Postings:</strong> {jobs.length}</p>
        <p><strong>Total Applications Received:</strong> {applications.length}</p>
      </div>

      {/* New Photo Section */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <h3 style={{ marginBottom: "10px" }}>Profile Photo/Logo</h3>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
          {username.photoUrl ? (
            <img src={username.photoUrl} alt="Profile/Logo" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
              No Photo
            </div>  
          )}
          <label style={{ padding: "5px 10px", background: "#007bff", color: "white", borderRadius: "3px", cursor: "pointer" }}>
            Upload/Change
            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
          </label>
        </div>
      </div>

      <button
        onClick={() => setShowJobForm(true)}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px 15px",
          border: "none",
          cursor: "pointer",
          marginBottom: "15px",
          display: "block",
          width: "100%",
        }}
        >
          + Post New Job
        </button>

        {showJobForm && (
  <div style={{ 
    padding: "32px", 
    border: "1px solid #eae7e0", 
    borderRadius: "8px", 
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginBottom: "32px"
  }}>
    <h3 style={{
      fontSize: "22px",
      fontWeight: "500",
      marginBottom: "20px",
      color: "#594e45"
    }}>New Job Posting</h3>
    <form onSubmit={handleJobSubmit}>
      <input 
        type="text" 
        name="title" 
        placeholder="Job Title" 
        value={newJob.title}
        onChange={handleInputChange} 
        required 
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: "18px",
          border: "1px solid #eae7e0",
          borderRadius: "6px",
          marginBottom: "16px"
        }}
      />
  <input 
        type="text" 
        name="location" 
        placeholder="Location" 
        value={newJob.location}
        onChange={handleInputChange} 
        required 
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: "18px",
          border: "1px solid #eae7e0",
          borderRadius: "6px",
          marginBottom: "16px"
        }}
      />
  <input 
        type="text" 
        name="salary" 
        placeholder="Salary" 
        value={newJob.salary}
        onChange={handleInputChange} 
        required 
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: "18px",
          border: "1px solid #eae7e0",
          borderRadius: "6px",
          marginBottom: "16px"
        }}
      />
  <textarea
        name="description" 
        placeholder="Job Description" 
        value={newJob.description}
        onChange={handleInputChange} 
        required 
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: "18px",
          border: "1px solid #eae7e0",
          borderRadius: "6px",
          marginBottom: "16px"
        }}
      />
  <input 
        name="qualifications" 
        placeholder="Qualification Requirements" 
        value={newJob.qualifications}
        onChange={handleInputChange} 
        required 
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: "18px",
          border: "1px solid #eae7e0",
          borderRadius: "6px",
          marginBottom: "16px"
        }}
      />
  <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
        <button 
          type="submit"
          style={{
            backgroundColor: "#5c6ac4",
            color: "white",
            padding: "12px 20px",
            fontSize: "18px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            flex: "1",
            transition: "background-color 0.3s"
          }}
        >Submit Job</button>
        <button 
          type="button" 
          onClick={() => setShowJobForm(false)}
          style={{
            backgroundColor: "#eae7e0",
            color: "#594e45",
            padding: "12px 20px",
            fontSize: "18px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            flex: "1",
            transition: "background-color 0.3s"
          }}
        >Cancel</button>
      </div>
    </form>
  </div>
)}

<h3>Job Postings</h3>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
<table style={{ 
  width: "100%", 
  borderCollapse: "separate",
  borderSpacing: "0",
  marginTop: "24px",
  border: "1px solid #eae7e0",
  borderRadius: "8px",
  overflow: "hidden"
}}>          
<thead>
    <tr style={{ background: "#eae7e0" }}>
      <th style={{ 
        padding: "16px", 
        textAlign: "left",
        color: "#594e45",
        fontWeight: "500",
        fontSize: "18px"
      }}>Job Title</th>
<th style={{ 
        padding: "16px", 
        textAlign: "left",
        color: "#594e45",
        fontWeight: "500",
        fontSize: "18px"
      }}>Location</th>              
<th style={{ 
        padding: "16px", 
        textAlign: "left",
        color: "#594e45",
        fontWeight: "500",
        fontSize: "18px"
      }}>Salary</th>              
<th style={{ 
        padding: "16px", 
        textAlign: "left",
        color: "#594e45",
        fontWeight: "500",
        fontSize: "18px"
      }}>Application Received</th>            
      </tr>
          </thead>
          <tbody>

          {jobApplicationCount.map((job) => (
      <tr key={job._id} style={{ 
        borderBottom: "1px solid #eae7e0",
        transition: "background-color 0.2s"
      }}>
        <td style={{ 
          padding: "16px",
          fontSize: "18px"
        }}>{job.title}</td>
<td style={{ 
          padding: "16px",
          fontSize: "18px"
        }}>{job.location}</td>                
<td style={{ 
          padding: "16px",
          fontSize: "18px"
        }}>{job.salary}</td>                
<td style={{ 
          padding: "16px",
          fontSize: "18px"
        }}>{job.applicationsReceived}</td>              
        </tr>
            ))}
          </tbody>
        </table>
      )}

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No applications received yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f4f4f4", textAlign: "left" }}>
              <th style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>Applicant</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>Email</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>Phone</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>Resume</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>Cover Letter</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} style={{ borderBottom: "1px solid #ccc" }}>
                <td style={{ padding: "10px" }}>{app.applicantName}</td>
                <td style={{ padding: "10px" }}>{app.applicantEmail}</td>
                <td style={{ padding: "10px" }}>{app.applicantPhone}</td>
                <td style={{ padding: "10px" }}>
                <a href={`http://localhost:5001${app.resumeUrl}`} target="_blank" style={{ color: "blue" }}>View Resume</a>
                </td>
                <td style={{ padding: "10px" }}>
                <a href={`http://localhost:5001${app.coverLetterUrl}`} target="_blank" style={{ color: "blue" }}>View Cover Letter</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}