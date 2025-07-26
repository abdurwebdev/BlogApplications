import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // ✅ Import jwt-decode
import Cookies from 'js-cookie'; // ✅ Add this import
const CommentPage = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [newComment, setNewComment] = useState('');
  let isCommentAdmin = false;
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const fetchComments = async () => {
    try {
      console.log("Fetching comments for post ID:", postId);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/comment/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const fetchUser = () => {
    try {
      const token = Cookies.get('token'); // ✅ Get token from cookies
      if (token) {
        const decoded = jwtDecode(token); // ✅ Decode the JWT token
        console.log('Decoded token:', decoded); // ✅ Log decoded token
        setUserId(decoded._id || decoded.id); // Adjust based on token structure
      } else {
        console.error('No token found in cookies');
      }
    } catch (err) {
      console.error('User fetch error:', err);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchUser();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comment/${postId}`,
        { content: newComment },
        { withCredentials: true }
      );
      isCommentAdmin = true;
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/comment/delete/${id}`, {
        withCredentials: true,
      });
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleEdit = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/comment/update/${id}`,
        { content: editContent },
        { withCredentials: true }
      );
      setEditId(null);
      setEditContent('');
      fetchComments();
    } catch (err) {
      console.error('Error editing comment:', err);
    }
  };

  return (
    <div className='w-full min-h-screen bg-black'>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            className="w-full sm:w-96 h-10 rounded-md bg-zinc-800 text-white outline-none px-3"
          />
          <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 rounded-md text-white mt-3">
            Post
          </button>
        </form>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-zinc-800 p-4 rounded-md text-white">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">
                  {comment.user?.username || 'Unknown User'} • {moment(comment.createdAt).fromNow()}
                </div>
                  <div className="flex gap-x-2">
                  {(comment.user?._id === userId || comment.user === userId) && (
  <div className="flex gap-x-2">
    <button
      onClick={() => {
        setEditId(comment._id);
        setEditContent(comment.content);
      }}
      className="text-blue-400 hover:underline"
    >
      Edit
    </button>
    <button
      onClick={() => handleDelete(comment._id)}
      className="text-red-400 hover:underline"
    >
      Delete
    </button>
  </div>
)}

                    
                  </div>
              </div>

              {editId === comment._id ? (
                <div className="mt-2">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full sm:w-96 h-10 rounded-md bg-zinc-700 text-white outline-none px-3"
                  />
                  <button
                    onClick={() => handleEdit(comment._id)}
                    className="ml-2 px-3 py-1 bg-green-500 rounded-md text-white"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p className="mt-2">{comment.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentPage;