import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function EditBlog() {
  const { id } = useParams(); // Blog ID from URL
  const navigate = useNavigate();
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    tags: '',
  });

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blog/${id}`, {
        withCredentials: true,
      });
      const fetched = res.data;
      setBlog({
        title: fetched.title,
        content: fetched.content,
        tags: fetched.tags.join(', '), // convert array to comma-separated string
      });
    } catch (error) {
      console.error("Failed to fetch blog:", error);
    }
  };

  const handleChange = (e) => {
    setBlog({
      ...blog,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/update/${id}`, blog, {
        withCredentials: true,
      });
      alert("Blog updated successfully!");
      navigate("/me");
    } catch (error) {
      console.error("Failed to update blog:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white p-6 font-[gilroy]">
      <Link to="/profile" className="text-blue-300 underline">← Back to Profile</Link>
      <h1 className="text-3xl font-bold mt-4">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 w-full max-w-xl">
        <input
          type="text"
          name="title"
          value={blog.title}
          onChange={handleChange}
          placeholder="Title"
          className="px-4 py-2 bg-zinc-800 rounded outline-none"
          required
        />
        <textarea
          name="content"
          value={blog.content}
          onChange={handleChange}
          placeholder="Content"
          rows={6}
          className="px-4 py-2 bg-zinc-800 rounded outline-none"
          required
        ></textarea>
        <input
          type="text"
          name="tags"
          value={blog.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="px-4 py-2 bg-zinc-800 rounded outline-none"
        />
        <button type="submit" className="px-6 py-2 bg-yellow-500 rounded-md font-semibold">
          Update Blog
        </button>
      </form>
    </div>
  );
}

export default EditBlog;
