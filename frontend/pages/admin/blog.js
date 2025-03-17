import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navigation from "../../components/Navigation";

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [mode, setMode] = useState("create");
  const [message, setMessage] = useState("");
  
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    // Fetch admin status
    fetch("http://localhost:5001/api/auth/user-profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Not authorized");
        return res.json();
      })
      .then(data => {
        if (!data.isAdmin) {
          router.push("/");
          return;
        }
        fetchPosts();
      })
      .catch(error => {
        console.error("Error checking admin status:", error);
        router.push("/");
      });
  }, [router, token]);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/blog-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Failed to fetch posts");
      
      const data = await res.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = mode === "create" 
        ? "http://localhost:5001/api/blog-posts" 
        : `http://localhost:5001/api/blog-posts/${selectedPost._id}`;
      
      const method = mode === "create" ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error("Failed to save post");
      
      setMessage(mode === "create" ? "Post created successfully!" : "Post updated successfully!");
      setFormData({ title: "", content: "" });
      setMode("create");
      setSelectedPost(null);
      
      fetchPosts();
    } catch (error) {
      console.error("Error saving post:", error);
      setMessage("Failed to save post. Please try again.");
    }
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setFormData({ title: post.title, content: post.content });
    setMode("edit");
  };

  const handleDelete = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      const res = await fetch(`http://localhost:5001/api/blog-posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Failed to delete post");
      
      setMessage("Post deleted successfully!");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      setMessage("Failed to delete post. Please try again.");
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-gray-900 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Senior Jobs - Admin</h1>
          <Navigation />
        </div>
      </header>
      
      {/* Content */}
      <div className="container mx-auto mt-8 p-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Blog Post Management</h2>
        
        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{message}</div>
        )}
        
        {/* Blog Post Form */}
        <div className="mb-8 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {mode === "create" ? "Create New Post" : "Edit Post"}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows="10"
                className="w-full p-2 border rounded"
                required
              ></textarea>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                {mode === "create" ? "Create Post" : "Update Post"}
              </button>
              
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("create");
                    setSelectedPost(null);
                    setFormData({ title: "", content: "" });
                  }}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Blog Posts List */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Existing Posts</h3>
          
          {loading ? (
            <p>Loading posts...</p>
          ) : posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post._id} className="p-4 border rounded flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{post.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(post.date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="bg-yellow-500 text-white py-1 px-3 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}