import React from 'react';
import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";

export default function Resources() {
  const [posts, setPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch blog posts
    fetch("/api/blog-posts")
      .then(res => {
        if (!res.ok) return [];
        return res.json();
      })
      .then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching blog posts:", error);
        setLoading(false);
      });
  }, []);

  const togglePost = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
    }
  };

  // Sample initial post if no posts exist yet
  const samplePost = {
    _id: "sample1",
    title: "Embracing Technology in Retirement",
    content: "Digital literacy is becoming increasingly important for seniors in today's lifestyle and job market. Many retirees are finding that learning new technologies can open doors to flexible, part-time work opportunities that can supplement retirement income while providing mental stimulation and social connection...",
    date: new Date().toISOString()
  };

  const displayPosts = posts.length > 0 ? posts : [samplePost];

  return (
    <div>
  {/* Header Section */}
  <header style={{ 
    backgroundColor: "#f5f2ed",
    color: "#2c2c2c",
    padding: "20px 0 0",
    marginBottom: "40px",
    textAlign: "center"
  }}>
    <div className="container mx-auto flex justify-center items-center flex-col">
      <h1 className="text-3xl font-medium mb-2">Senior Jobs</h1>
      <Navigation />
    </div>
  </header>
  
  {/* Content Section */}
  <div style={{
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "0 24px"
  }}>
    <h2 style={{
      fontSize: "28px",
      fontWeight: "500",
      marginBottom: "32px",
      textAlign: "center",
      color: "#594e45"
    }}>Resources & Articles</h2>
        
        {loading ? (
      <p className="text-center" style={{ fontSize: "18px" }}>Loading resources...</p>
    ) : (
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {displayPosts.map(post => (
          <div key={post._id} style={{
            marginBottom: "24px",
            border: "1px solid #eae7e0",
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}>
            <div 
              style={{
                padding: "20px",
                backgroundColor: "#eae7e0",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
              onClick={() => togglePost(post._id)}
            >
              <h3 style={{
                fontSize: "22px",
                fontWeight: "500",
                color: "#594e45"
              }}>{post.title}</h3>
              <div style={{
                fontSize: "16px",
                color: "#594e45"
              }}>
                {new Date(post.date).toLocaleDateString()}
              </div>
            </div>
                
            {expandedPostId === post._id && (
              <div style={{
                padding: "24px",
                backgroundColor: "white",
                fontSize: "18px",
                lineHeight: "1.6"
              }}>
                <p className="whitespace-pre-line">{post.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
</div>
  );
}