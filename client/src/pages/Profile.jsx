import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [myBlogs, setMyBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchMyBlogs();
  }, []);

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

  const handleDelete = async (blogId) => {
    const confirm = window.confirm("Are you sure you want to delete this blog?");
    if (!confirm) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/delete/${blogId}`, {
        withCredentials: true,
      });
      fetchMyBlogs(); // refresh blog list
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  };

  return (
    <div className='w-full min-h-screen bg-black text-white font-[gilroy]'>
      <Link to="/home" className='p-4 inline-block'>Create Blogs</Link>

      {user ? (
        <>
          <div className='flex flex-col items-start w-fit justify-between p-4'>
            <h1 className='text-3xl font-bold'>Welcome <span className='font-normal'>{user.username} 👋</span></h1>
            <h1 className='text-2xl'>Email: {user.email}</h1>
            <p>Bio: {user.bio}</p>
          </div>
          <div className='w-full flex items-end justify-end px-4'>
          <button
              onClick={async () => {
                try {
                  await axios.get(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
                    withCredentials: true
                  })
                  navigate('/')
                } catch (error) {
                  console.error('Logout Failed:', error)
                }
              }}
              className="px-5 py-2 absolute top-5 rounded-md bg-red-500"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <h1>Loading user data...</h1>
      )}

      <h1 className='text-3xl p-4 font-bold'>Your Blogs</h1>
      <div className="parent p-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-y-4 gap-x-4">
        {myBlogs.length > 0 ? myBlogs.map((blog) => (
          <div key={blog._id} className="blogs w-full min-h-62 rounded-md bg-zinc-700 px-5 py-2">
            <h3 className="text-xl font-semibold truncate">{blog.title}</h3>
            <p className="text-sm text-gray-300 truncate">{blog.slug}</p>
            <p className="my-2 truncate">{blog.content}</p>
            <p className='truncate'>Tags: {blog.tags?.join(", ")}</p>
            <p className='truncate'>Is Published: {blog.isPublished ? "true" : "false"}</p>
            <p className='truncate'>Created At: {new Date(blog.createdAt).toLocaleDateString()}</p>
            <p className='truncate'>Published At: {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : "N/A"}</p>
            <div className='flex items-center justify-between mt-2'>
              <Link to={`/meedit/${blog._id}`} className='text-blue-200 hover:underline'>Edit</Link>
              <button onClick={() => handleDelete(blog._id)} className='text-red-300 hover:underline'>Delete</button>
            </div>
          </div>
        )) : (
          <p>No blogs created yet.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
