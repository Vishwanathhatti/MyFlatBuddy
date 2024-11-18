import React from 'react'
import { Button } from './ui/button'
import { ArrowUpRight } from 'lucide-react'

const PostOrBrowse = () => {
    return (
        <div className='w-full h-[40vh] flex flex-col justify-center items-center post-or-browse'>
            <div className='text-center'>
                <h1 className='text-white font-bold text-2xl'>Looking for a PG or finding a roomate?</h1>
                <h2 className='text-white font-semibold text-lg'>MyFlatBuddy provides you an awesome solution!</h2>
            </div>
            <div className='flex gap-5 justify-center items-center mt-2'>
                <Button className="bg-orange-600 hover:bg-[#ffffff] hover:text-black hover-arrow">Create Post <ArrowUpRight className='arrow-hover-ani' /></Button>
                <Button className="bg-[#ffffff34] border hover:bg-[#ffffff] hover:text-black hover-arrow">Browse <ArrowUpRight className='arrow-hover-ani' /> </Button>
            </div>
        </div>
    )
}

export default PostOrBrowse