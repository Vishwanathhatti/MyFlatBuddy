import React from 'react'
import blogImage from '../assets/homeBlog.jpg'
const HomeBlog = () => {
  return (
<div className="w-full my-2">
    <h1 className='w-full px-5 text-3xl font-semibold text-orange-600'>Blogs</h1>
  <div className="w-full p-3 flex justify-center items-center flex-wrap gap-3">
    {/* This div's height will be limited to its content */}
    <div className="w-full md:w-2/5 h-full flex flex-col justify-center items-center border border-black rounded-lg overflow-hidden">
      <div className="w-full h-60 md:h-72 flex justify-center items-center overflow-hidden">
        <img src={blogImage} alt="" className="object-cover" />
      </div>
      <div className="p-4">
        <h1 className="font-bold text-2xl text-center">Find a place you can call home</h1>
      </div>
    </div>

    <div className='w-full md:w-2/5 flex flex-col justify-center items-center'>
      
      {/* Cards section with dynamic height */}
      <div className='flex items-center pl-5 justify-between w-full h-36 border border-black my-1 rounded-md overflow-hidden'>
        <div className='flex justify-center w-2/5'>
          <h1 className='text-xl font-semibold'>Find a place to call home</h1>
        </div>
        <div className='flex justify-center  w-2/5 h-full overflow-hidden'>
          <img src={blogImage} className='object-cover' alt="" />
        </div>
      </div>

      {/* Repeat this pattern for each card */}
      <div className='flex items-center pl-5 justify-between w-full h-36 border border-black my-1 rounded-md overflow-hidden'>
        <div className='flex justify-center w-2/5'>
          <h1 className='text-xl font-semibold'>Find a place to call home</h1>
        </div>
        <div className='flex justify-center  w-2/5 h-full overflow-hidden'>
          <img src={blogImage} className='object-cover' alt="" />
        </div>
      </div>

      {/* Additional cards */}
      <div className='flex items-center pl-5 justify-between w-full h-36 border border-black my-1 rounded-md overflow-hidden'>
        <div className='flex justify-center w-2/5'>
          <h1 className='text-xl font-semibold'>Find a place to call home</h1>
        </div>
        <div className='flex justify-center  w-2/5 h-full overflow-hidden'>
          <img src={blogImage} className='object-cover' alt="" />
        </div>
      </div>

    </div>
  </div>
</div>

  )
}

export default HomeBlog