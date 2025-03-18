import React from 'react';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navigation from "../components/Navigation";

export default function JobSeekerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    const fetchProfileAndApplications = async () => {
      try {
        // Fetch user profile
        const profileRes = await fetch("/api/auth/user-profile", {
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
        setUserData(profileData);
        setFormData(profileData);
  
        // Fetch user applications
        const appsRes = await fetch("/api/applications/user-applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!appsRes.ok) throw new Error(`Error: ${appsRes.status}`);
        const appsData = await appsRes.json();
        setApplications(Array.isArray(appsData) ? appsData : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setApplications([]);
        setLoading(false);
      }
    };
  
    fetchProfileAndApplications();
  }, [router, token]);


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
        const profileRes = await fetch("/api/auth/user-profile", { // Refetch profile
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();
        setUserData(profileData)
        alert('Photo uploaded successfully!');
      } else {
        alert('Failed to upload photo.');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    
    fetch("/api/auth/update-profile", {  // changed to /api/
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update profile");
        return res.json();
      })
      .then(data => {
        setUserData(data);
        setEditMode(false);
        alert("Profile updated successfully!");
      })
      .catch(error => {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
      });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      {/* Updated header with centered title */}
      <header style={{ 
        backgroundColor: "#e6e4e0",
        color: "#2c2c2c",
        padding: "20px 0 0",
        marginBottom: "30px",
        textAlign: "center"
      }}>
        <h1 className="text-3xl font-medium text-center">Senior Jobs</h1>
        <Navigation />
      </header>
      
      <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Job Seeker Dashboard</h1>
        <p style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>
          Hello, <strong>{userData.name}</strong>! Welcome to your dashboard. Here you can see the job applications you have applied to.
        </p>

      {/* User Profile Section */}
      <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "5px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>User Profile</h3>
          <button 
            onClick={() => setEditMode(!editMode)} 
            style={{ padding: "5px 10px", background: "#007bff", color: "white", border: "none", borderRadius: "3px" }}
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {editMode ? (
          <form onSubmit={handleProfileUpdate}>
            <div style={{ marginBottom: "10px" }}>
              <label>Name:</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} required />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Email:</label>
              <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} required />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Phone:</label>
              <input type="text" name="phone" value={formData.phone || ''} onChange={handleInputChange} />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>City:</label>
              <input type="text" name="location.city" value={formData.location?.city || ''} 
                onChange={(e) => setFormData({...formData, location: {...formData.location, city: e.target.value}})} />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Country:</label>
              <input type="text" name="location.country" value={formData.location?.country || ''} 
                onChange={(e) => setFormData({...formData, location: {...formData.location, country: e.target.value}})} />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Gender:</label>
              <select name="gender" value={formData.gender || ''} onChange={handleInputChange}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Date of Birth:</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''} 
                onChange={handleInputChange} />
            </div>
            <button type="submit" style={{ padding: "5px 10px", background: "green", color: "white", border: "none", borderRadius: "3px" }}>
              Save Changes
            </button>
          </form>
        ) : (
          <div>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Phone:</strong> {userData.phone || 'Not provided'}</p>
            <p><strong>Location:</strong> {userData.location?.city && userData.location?.country ? 
              `${userData.location.city}, ${userData.location.country}` : 'Not provided'}</p>
            <p><strong>Gender:</strong> {userData.gender || 'Not provided'}</p>
            <p><strong>Date of Birth:</strong> {userData.dateOfBirth ? 
              new Date(userData.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
              {/* Photo section */}
            <div style={{ marginTop: "10px" }}>  
              <strong>Profile Photo:</strong>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {userData.photoUrl ? (
                  <img src={userData.photoUrl} alt="Profile" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }} />
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
              </div>    
                )}
          </div>

      {/* Applications Section */}
      <h3 style={{ marginTop: "30px" }}>Your Job Applications</h3>
      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
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
      }}>Company</th>
<th style={{ 
        padding: "16px", 
        textAlign: "left",
        color: "#594e45",
        fontWeight: "500",
        fontSize: "18px"
      }}>Applied On</th>
<th style={{ 
        padding: "16px", 
        textAlign: "left",
        color: "#594e45",
        fontWeight: "500",
        fontSize: "18px"
      }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id} style={{ borderBottom: "1px solid #eae7e0" }}>
                <td style={{ padding: "16px", fontSize: "16px" }}>{app.jobTitle}</td>
                <td style={{ padding: "16px", fontSize: "16px" }}>{app.employerName || 'Unknown'}</td>
                <td style={{ padding: "16px", fontSize: "16px" }}>{formatDate(app.createdAt)}</td>
                <td style={{ padding: "16px", fontSize: "16px" }}>{app.status || 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
}