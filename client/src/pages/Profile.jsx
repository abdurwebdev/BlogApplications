import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [myBlogs, setMyBlogs] = useState([]);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', tags: '', isPublished: false });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchMyBlogs();
  }, []);

  // Fetch logged-in user data
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/home`, {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  // Fetch blogs created by logged-in user
  const fetchMyBlogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/myblogs`, {
        withCredentials: true,
      });
      setMyBlogs(res.data);
    } catch (error) {
      console.error("Failed to fetch user blogs:", error);
    }
  };

  // Delete a blog by ID and refresh list
  const handleDelete = async (blogId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/delete/${blogId}`, {
        withCredentials: true,
      });
      fetchMyBlogs();
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  };

  // Start editing a blog: set editing id and fill form with current data
  const startEditing = (blog) => {
    setEditingBlogId(blog._id);
    setEditForm({
      title: blog.title,
      content: blog.content,
      tags: blog.tags?.join(", ") || '',
      isPublished: blog.isPublished,
    });
  };

  // Handle input changes in edit form
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submit the edited blog update
  const handleEditSubmit = async (blogId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/update/${blogId}`,
        {
          title: editForm.title,
          content: editForm.content,
          tags: editForm.tags.split(",").map(tag => tag.trim()).filter(Boolean),
          isPublished: editForm.isPublished,
        },
        { withCredentials: true }
      );
      setEditingBlogId(null);
      fetchMyBlogs();
    } catch (error) {
      console.error("Failed to update blog:", error);
    }
  };

  // Cancel editing mode
  const cancelEditing = () => {
    setEditingBlogId(null);
  };

  return (
    <div className="w-full min-h-screen bg-black text-white font-[gilroy]">
      <Link to="/home" className="p-4 inline-block text-blue-400 hover:underline">
        Create Blogs
      </Link>

      {user ? (
        <>
          <div className="flex flex-col items-start w-fit justify-between p-4">
            <h1 className="text-3xl font-bold">
              Welcome <span className="font-normal">{user.username} 👋</span>
            </h1>
            <h2 className="text-2xl">Email: {user.email}</h2>
            <p>Bio: {user.bio || "No bio provided."}</p>
          </div>
          <div className="w-full flex items-end justify-end px-4 relative">
            <button
              onClick={async () => {
                try {
                  await axios.get(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
                    withCredentials: true,
                  });
                  navigate('/');
                } catch (error) {
                  console.error('Logout Failed:', error);
                }
              }}
              className="px-5 py-2 absolute top-5 right-4 rounded-md bg-red-500 hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <h1>Loading user data...</h1>
      )}

      <h1 className="text-3xl p-4 font-bold">Blogs Created</h1>

      <div className="parent p-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-y-4 gap-x-4">
        {myBlogs.length > 0 ? (
          myBlogs.map((blog) => (
            <div key={blog._id} className="blogs w-full min-h-62 rounded-md bg-zinc-700 px-5 py-2">
              {editingBlogId === blog._id ? (
                <>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="w-full mb-2 p-1 rounded bg-zinc-800 text-white outline-none"
                    placeholder="Title"
                  />
                  <textarea
                    name="content"
                    value={editForm.content}
                    onChange={handleEditChange}
                    className="w-full mb-2 p-1 rounded bg-zinc-800 text-white outline-none"
                    placeholder="Content"
                    rows={4}
                  />
                  <input
                    type="text"
                    name="tags"
                    value={editForm.tags}
                    onChange={handleEditChange}
                    className="w-full mb-2 p-1 rounded bg-zinc-800 text-white outline-none"
                    placeholder="Tags (comma separated)"
                  />
                  <label className="inline-flex items-center mb-2">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={editForm.isPublished}
                      onChange={handleEditChange}
                      className="mr-2"
                    />
                    Published
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSubmit(blog._id)}
                      className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold truncate">{blog.title}</h3>
                  <p className="text-sm text-gray-300 truncate">{blog.slug}</p>
                  <p className="my-2 truncate">{blog.content}</p>
                  <p className="truncate">Tags: {blog.tags?.join(", ")}</p>
                  <p className="truncate">Is Published: {blog.isPublished ? "Yes" : "No"}</p>
                  <p className="truncate">Created At: {new Date(blog.createdAt).toLocaleDateString()}</p>
                  <p className="truncate">
                    Published At: {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : "N/A"}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <button
                      onClick={() => startEditing(blog)}
                      className="text-blue-200 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-red-300 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400">You haven't created any blogs yet.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
