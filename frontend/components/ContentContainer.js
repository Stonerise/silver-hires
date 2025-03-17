import React from 'react';

export default function ContentContainer({ children, title }) {
  return (
    <div style={{
      maxWidth: "1000px",
      margin: "0 auto 40px",
      padding: "32px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      border: "1px solid #eae7e0"
    }}>
      {title && <h2 style={{
        fontSize: "24px",
        fontWeight: "500",
        marginBottom: "24px",
        color: "#594e45",
        textAlign: "center"
      }}>{title}</h2>}
      {children}
    </div>
  );
}