import React, { useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
function Register(){
  let [username,setUsername] = useState('');
  let [email,setEmail] = useState('');
  let [password,setPassword] = useState('');
  let [bio,setBio] = useState('');
  const handleRegister = async (e) =>{
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/register`,{
        username,
        email,
        password,
        bio
      })
      alert(res.data);
    } catch (error) {
      alert("Error : "+ error.message);
    }
  }
  return (
    <>
    <div id="main" className='w-full h-screen bg-black flex items-center text-white font-[gilroy] flex-col justify-center p-4'>
      <div>
        <h1 className='font-bold text-3xl mb-3 w-full  '>Register Your Account</h1>
      <form onSubmit={handleRegister} className='w-full sm:flex sm:items-start sm:justify-start  sm:flex-col'>
        <div>
        <h1>Enter your username</h1>
        <input className='w-full h-10 sm:w-96 rounded-md bg-zinc-800 outline-none placeholde:text-white px-3' value={username} type="text" onChange={(e)=>{
          setUsername(e.target.value)
        }}  placeholder='Enter Your username'/>
        <h1>Enter your email</h1>
        <input className='w-full h-10 sm:w-96 rounded-md bg-zinc-800 outline-none placeholde:text-white px-3' type="text" value={email} onChange={(e)=>{
          setEmail(e.target.value)
        }}  placeholder='Enter Your email'/>
        <h1>Enter your password</h1>
        <input className='w-full sm:w-96 h-10 rounded-md bg-zinc-800 outline-none placeholde:text-white px-3' type="password" value={password} onChange={(e)=>{
          setPassword(e.target.value)
        }}  placeholder='Enter Your password'/>
        <h1>Enter your bio</h1>
        <textarea  className='sm:w-96 w-full h-10 rounded-md bg-zinc-800 outline-none resize-none placeholde:text-white px-3' value={bio} onChange={(e)=>{
          setBio(e.target.value)
        }} placeholder='Enter Your bio'></textarea>
        <input className='block mt-3 bg-blue-500 px-5 py-2 w-full rounded-md' type="submit" value="Register" />
        <Link className='text-white mt-3' to="/">Already have an account?Login</Link>
        </div>
      </form>
      </div>
    </div>
    </>
  )
}

export default Register;
