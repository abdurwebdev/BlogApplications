import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';
import Profile from './pages/Profile'
import AllBlogs from './pages/AllBlogs';
import MeEdit from './pages/MeEdit';
import EditBlog from './pages/EditBlog';
import CommentPage from './pages/CommentPage';
function App(){
  return(
    <>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/me' element={<Profile/>}/>
      <Route path='/allblogs' element={<AllBlogs/>}/>
      <Route path='/meedit' element={<MeEdit/>}/>
      <Route path="/meedit/:id" element={<EditBlog/>} />
      <Route path="/comments/:postId" element={<CommentPage/>} />
    </Routes>
    </>
  )
}

export default App;