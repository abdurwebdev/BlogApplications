import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Home() {
  const [user, setData] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const navigate = useNavigate()

  const userData = async () => {
    try {
      let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/home`, {
        withCredentials: true
      })
      setData(res.data)
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      setData(null)
      // Optional: redirect if not authenticated
      navigate('/')
    }
  }

  useEffect(() => {
    userData()
  }, [])

  const createBlog = async (e) => {
    e.preventDefault()

    if (!user) {
      alert('You must be logged in to create a blog.')
      return
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create`,
        {
          title,
          content,
          tags
        },
        {
          withCredentials: true
        }
      )
      alert('Blog Created Successfully!')
      setTitle('')
      setContent('')
      setTags('')
    } catch (error) {
      console.error('Blog Not Created:', error)
      alert('Blog creation failed.')
    }
  }

  return (
    <div className="w-full min-h-screen bg-black text-white font-[gilroy]">
      <Link className="p-4 inline-block" to="/me">
        Profile Settings
      </Link>

      {user ? (
        <>
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold">
              Welcome <span className="font-normal">{user.username} 👋</span>
            </h1>
            <h1 className="text-xl font-bold">Email: {user.email}</h1>
          </div>
          <div className="w-full flex items-end justify-end px-4">
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
              className="px-5 py-2 rounded-md bg-red-500"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <h1 className="p-4 text-lg">Loading user data...</h1>
      )}

      {/* Show form only when user is logged in */}
      {user && (
        <div className="w-full p-4">
          <h1 className="text-3xl">Create A Blog!</h1>
          <form onSubmit={createBlog}>
            <div className="w-full flex flex-col gap-y-3 mt-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                className="px-4 sm:w-96 h-10 rounded-md outline-none bg-zinc-700 placeholder:text-white"
                placeholder="Enter Blog Title"
              />
              <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                type="text"
                className="px-4 h-10 sm:w-96 rounded-md outline-none bg-zinc-700 placeholder:text-white"
                placeholder="Enter Blog Content"
              />
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                type="text"
                className="px-4 h-10 sm:w-96 rounded-md outline-none bg-zinc-700 placeholder:text-white"
                placeholder="Enter Blog Tags"
              />
            </div>
            <input
              className="px-5 w-full sm:w-96 py-2 rounded-md mt-3 bg-blue-500"
              type="submit"
              value="Create Blog"
            />
          </form>
        </div>
      )}

      <Link className="p-4 inline-block" to="/allblogs">
        Read All Blogs
      </Link>
    </div>
  )
}

export default Home
