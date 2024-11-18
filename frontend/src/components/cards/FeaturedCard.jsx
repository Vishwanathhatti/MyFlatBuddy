import React from 'react'
import room from "../cards/room.jpg"
import { Button } from '../ui/button'
import { Bookmark } from 'lucide-react'
const FeaturedCard = () => {
    return (

            <div className='flex flex-col   shadow-xl hover:shadow-2xl transition-shadow border border-gray-400 border-0.1 rounded-xl overflow-hidden '>
                <div className='flex gap-2'>
                    <img src={room} className='w-[35%] object-cover  rounded-lg rounded-r-none rounded-b-none ' />
                    <div className='flex flex-col p-2'>
                        <h1 className='font-medium'>Vishwanath Hatti</h1>
                        <p>Zolo Supreme, Karve Nagar, Pune- 411052</p>
                        <div className='flex mt-2 justify-around'>
                            <div className='flex justify-center flex-col items-center '>
                                <h1 className='font-semibold'>Total Bed's</h1>
                                <h1 className='font-medium'>5</h1>
                            </div>

                            <div className='flex justify-center flex-col items-center '>
                                <h1 className='font-semibold'>BHK</h1>
                                <h1 className='font-medium'>2</h1>
                            </div>

                            <div className='flex justify-center flex-col items-center '>
                                <h1 className='font-semibold'>Rent</h1>
                                <h1 className='font-medium'>4000</h1>
                            </div>

                            <div className='flex justify-center flex-col items-center '>
                                <h1 className='font-semibold'>Gender</h1>
                                <h1 className='font-medium'>Male</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className='w-[95%] h-0.5 my-2 bg-gray-500 mx-auto ' />
                <div className='flex w-full gap-4 px-4 pb-2'>
                    <Button className="ml-auto" variant="outline"><Bookmark /> Save</Button>
                    <Button className=" bg-blue-600 hover:bg-blue-700">Connect</Button>
                </div>
            </div>

    )
}

export default FeaturedCard