import React from 'react'
import { Link } from 'react-router-dom';
function MeEdit(){
  return (
    <>
    <div id="main" className='w-full font-[gilroy] text-white h-screen p-4 bg-black'>
      <Link to='/me'>Profile</Link>
     <div className='w-full'>
      <h1 className='text-3xl'>Edit A Blog!</h1>
      <form>
        <div  className='w-full flex gap-x-5'>
      <input type="text" className='w-96 px-4 h-10 mt-2 rounded-md outline-none bg-zinc-700 placeholder:text-white' placeholder='Enter Blog Title' />
      <input type="text" className='w-96 px-4 h-10 mt-2 rounded-md outline-none bg-zinc-700 placeholder:text-white' placeholder='Enter Blog Content' />
      <input type="text" className='w-96 px-4 h-10 mt-2 rounded-md outline-none bg-zinc-700 placeholder:text-white' placeholder='Enter Blog Tags' />
      </div>
      <input className='w-96 px-5 py-2 rounded-md mt-3 bg-yellow-500' type="submit" value="Edit Blog"/>
      </form>
    </div>
    </div></>
  )
}

export default MeEdit;