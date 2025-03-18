import React from 'react';
import { useState, useEffect } from 'react';
import Navigation from "../components/Navigation";

export default function Volunteer() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);

  // this is a placeholder for the actual data fetching logic
  useEffect(() => {
    // simulating data fetch
    // replace this with actual API call
    const fetchPosts = async () => {
      try {
        // simulate api delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // sample data - replace with actual API response
        const samplePosts = [
          {
            _id: '1',
            title: 'Nature Walk Volunteer',
            content: 'Looking for a volunteer to take tourists on a nature walk near the city. Retirees from Forest service are welcome to apply.',
            date: new Date().toISOString()
          },
          {
            _id: '2',
            title: 'Admin Volunteer for Local Nonprofit',
            content: 'Need a volunteer to help with admin work for an Animal Welfare Nonprofit. Preferred experience in admin and clerical work. Retirees welcome.',
            date: new Date().toISOString()
          }
        ];

        setPosts(samplePosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Function to toggle expanded post
  const togglePost = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null); // Collapse if already expanded
    } else {
      setExpandedPostId(postId); // Expand the clicked post
    }
  };

  // Posts to display
  const displayPosts = posts;


  return (
    <div>
  {/* Header Section */}
  <header style={{ 
    backgroundColor: "#594e45",
    color: "white",
    padding: "20px 0 0",
    marginBottom: "40px"
  }}>
    <div className="container mx-auto">
      <h1 className="text-3xl font-medium text-center">Senior Jobs</h1>
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
    }}>Volunteer Positions</h2>
    
    {loading ? (
      <p className="text-center" style={{ fontSize: "18px" }}>No Volunteer Positions available at this time.</p>
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
  )}