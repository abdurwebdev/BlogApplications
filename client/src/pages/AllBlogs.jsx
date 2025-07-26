import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function AllBlogs() {
  let [blogs, setBlogs] = useState([]);
  let [userId, setUserid] = useState(null);

  // Search fields
  const [authorSearch, setAuthorSearch] = useState('');
  const [tagsSearch, setTagsSearch] = useState('');
  const [dateSearch, setDateSearch] = useState('');

  useEffect(() => {
    fetchBlogs();
    fetchUser();
  }, []);

  const fetchBlogs = async (params = {}) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/allblogs`, { params });
      setBlogs(res.data);
    } catch (error) {
      console.error("Failed To Fetch Blogs:", error);
    }
  };

  const fetchUser = async () => {
    try {
      let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/me`, { withCredentials: true });
      setUserid(res.data._id);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchBlogs({
      title: authorSearch,
      tags: tagsSearch,
      date: dateSearch,
    });
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/like/${postId}`, {}, { withCredentials: true });
      fetchBlogs();
    } catch (error) {
      console.error("Error Liking Post :", error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/dislike/${postId}`, {}, { withCredentials: true });
      fetchBlogs();
    } catch (error) {
      console.error("Error disliking :", error);
    }
  };

  return (
    <>
      <div id="main" className='w-full min-h-screen bg-black p-4 text-white'>
        <Link to='/home'  className='mt-3 text-base text-white '>Create Blog Posts.</Link>
        <div className='w-full'>
          <h1  className='mt-3 text-3xl font-bold'>Search By Title, Tags Or Date</h1>
          <form onSubmit={handleSearch} className='w-full flex gap-x-5 flex-wrap'>
            <input
              type="text"
              value={authorSearch}
              onChange={(e) => setAuthorSearch(e.target.value)}
              className='w-full px-4 h-10 mt-2 rounded-md outline-none bg-zinc-700 placeholder:text-white'
              placeholder='Search By Title'
            />
            <input
              type="text"
              value={tagsSearch}
              onChange={(e) => setTagsSearch(e.target.value)}
              className=' px-4 w-full h-10 mt-2 rounded-md outline-none bg-zinc-700 placeholder:text-white'
              placeholder='Search By Tags (comma separated)'
            />
            <input
              type="date"
              value={dateSearch}
              onChange={(e) => setDateSearch(e.target.value)}
              className=' px-4 h-10 mt-2 w-full rounded-md outline-none bg-zinc-700 placeholder:text-white'
            />
            <input type="submit" value="Search" className=' px-5 py-2 bg-yellow-500 rounded-md mt-3' />
          </form>
        </div>
        <h1 className='mt-3 text-3xl font-bold'>All Blogs</h1>
        <div className="parent mt-3 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-y-4 gap-x-4">
          {blogs.length > 0 ? (
            blogs.map((blog, index) => {
              const liked = blog.likes?.includes(userId);
              const disliked = blog.dislikes?.includes(userId);
              return (
                <div key={index} className="blogs w-full min-h-62 rounded-md bg-zinc-700 px-5 py-2">
                  <h3 className="text-xl truncate font-semibold">{blog.title}</h3>
                  <p className="text-sm text-gray-300 truncate">{blog.slug}</p>
                  <p className="my-2 truncate">{blog.content}</p>
                  <p className='truncate'>Tags: {blog.tags?.join(", ")}</p>
                  <p className='truncate'>Is Published: {blog.isPublished ? "true" : "false"}</p>
                  <p className='truncate'>Created At: {new Date(blog.createdAt).toLocaleDateString()}</p>
                  <p className='truncate'>Published At: {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : "N/A"}</p>
                  <div className='flex items-center justify-between'>
                    <button onClick={() => handleLike(blog._id)} className='px-5 py-2 rounded-md bg-blue-500'>{liked ? 'Unlike' : 'Like'} {blog.likes?.length}</button>
                    <button onClick={() => handleDislike(blog._id)} className='px-5 py-2 rounded-md bg-red-500'>{disliked ? 'Undislike' : 'Dislike'} {blog.dislikes?.length}</button>
                  </div>
                  <div className='flex items-center justify-between'>
                    <Link to={`/comments/${blog._id}`}>Comment</Link>
                  </div>
                </div>
              )
            })
          ) : (
            <p>No Blogs Found.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default AllBlogs;
