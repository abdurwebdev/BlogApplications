import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';

const CommentPage = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/me`, {
        withCredentials: true,
      });
      setUserId(res.data._id); // Ensure your /me route sends back {_id, ...}
    } catch (err) {
      console.error('User fetch error', err);
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
        `${import.meta.env.VITE_BACKEND_URL}/api/comments/${postId}`,
        { content: newComment },
        { withCredentials: true }
      );
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/comments/delete/${id}`, {
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
        `${import.meta.env.VITE_BACKEND_URL}/api/comments/update/${id}`,
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
    <div className="p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          className="w-full sm:w-96 h-10 rounded-md bg-zinc-800 text-white outline-none px-3"
        />
        <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 rounded-md text-white">
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
              {comment.user && comment.user._id === userId && (
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
  );
};

export default CommentPage;
