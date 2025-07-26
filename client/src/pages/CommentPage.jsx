import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import moment from 'moment';

function CommentPage() {
  const { postId } = useParams();
  const [cookies] = useCookies(['token']);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUserId(decoded._id);
    }
  }, []);
  useEffect(() => {
    fetchUser();
    fetchComments();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/me`, { withCredentials: true });
      setUserId(res.data._id);
    } catch (err) {
      console.error('User fetch error', err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/comment/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleAddComment = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comment/${postId}`,
        { content },
        { withCredentials: true }
      );
      setContent('');
      fetchComments();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleEdit = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/comment/${id}`,
        { content: editContent },
        { withCredentials: true }
      );
      setEditId(null);
      fetchComments();
    } catch (err) {
      console.error('Error editing comment:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/comment/${id}`, { withCredentials: true });
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  return (
    <div className='min-h-screen w-full bg-black text-white p-4'>
      <h1 className='text-2xl font-bold mb-4'>Comments</h1>

      <div className='mb-4'>
        <textarea
          className='w-full p-2 bg-zinc-800 text-white rounded-md'
          placeholder='Write a comment...'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleAddComment} className='mt-2 px-4 py-2 bg-yellow-500 rounded-md'>
          Add Comment
        </button>
      </div>

      <div className='space-y-4'>
        {comments.map((comment) => (
          <div key={comment._id} className='bg-zinc-700 p-3 rounded-md'>
            <p className='text-sm text-gray-300'>By: {comment.user?.username}</p>
            <p className='text-sm text-gray-400'>
              {moment(comment.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
            </p>

            {editId === comment._id ? (
              <>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className='w-full p-2 mt-2 bg-zinc-800 text-white rounded-md'
                />
                <button onClick={() => handleEdit(comment._id)} className='mt-2 px-4 py-2 bg-green-500 rounded-md'>
                  Save
                </button>
              </>
            ) : (
              <p className='mt-2'>{comment.content}</p>
            )}

{comment.user && comment.user._id === userId && (
  <div className='mt-2 flex gap-x-3'>
    <button
      onClick={() => {
        setEditId(comment._id);
        setEditContent(comment.content);
      }}
      className='px-3 py-1 bg-blue-500 rounded-md'
    >
      Edit
    </button>
    <button
      onClick={() => handleDelete(comment._id)}
      className='px-3 py-1 bg-red-500 rounded-md'
    >
      Delete
    </button>
  </div>
)}

          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentPage;
