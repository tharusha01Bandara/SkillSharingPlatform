import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants"; // Adjust if needed

function SkillPostList() {
  const [skillPosts, setSkillPosts] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/skillposts`) // make sure your backend endpoint is correct
      .then(res => setSkillPosts(res.data))
      .catch(err => {
        console.error("Failed to fetch skill posts", err);
        alert("Error loading skill posts.");
      });
  }, []);

  return (
    <div>
      <h2>All Skill Posts</h2>
      {skillPosts.length === 0 && <p>No skill posts found.</p>}
      <div>
        {skillPosts.map(post => (
          <div key={post.id} style={{ marginBottom: "30px", border: "1px solid #ccc", padding: "20px", borderRadius: "10px" }}>
            <h3>{post.title}</h3>
            <p>{post.description}</p>

            {post.imageUrls && post.imageUrls.split(",").map((url, index) => (
              <img
                key={index}
                src={url.trim()}
                alt="SkillPost"
                style={{ width: "200px", margin: "10px", objectFit: "cover" }}
              />
            ))}

            <p><small>Created at: {new Date(post.createdAt).toLocaleString()}</small></p>
            <p><small>Updated at: {new Date(post.updatedAt).toLocaleString()}</small></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillPostList;
