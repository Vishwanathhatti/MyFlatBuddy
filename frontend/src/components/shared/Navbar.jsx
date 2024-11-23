import React from 'react'
import { Avatar } from '../ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { Bookmark, LogOut, Menu } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import axios from 'axios'
import { toast } from 'sonner'

const Navbar = () => {
    const navigate= useNavigate()
    const logoutHandler = async()=>{
        try {
            const response= await axios.get('http://localhost:3001/api/v1/user/logout')
            if (response.data.success == true){
                toast.success(response.data.message)
                navigate('/login')
            }            
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data.message)
        }
    }

    return (
        <div className=' backdrop-blur-sm  w-full border-b-2'>
            <div className='flex items-center justify-between mx-auto px-5 h-16 max-w-7xl'>
                <div>
                    <h1 className='font-semibold text-orange-600 text-2xl'>MyFlatBuddy</h1>
                </div>
                <ul className='flex gap-5 '>
                    <li className='text-lg font-medium text-black hover:text-orange-600 hidden md:block'><Link to='/'>Home</Link></li>
                    <li className='text-lg font-medium text-black hover:text-orange-600 hidden md:block'><Link to='/about'>About</Link></li>
                    <li className='text-lg font-medium text-black hover:text-orange-600 hidden md:block'><Link to='/listings'>Listings</Link></li>
                    <li className='text-lg font-medium text-black hover:text-orange-600 hidden md:block'><Link to='/blog'>Blogs</Link></li>
                    <li className='text-lg font-medium text-black hover:text-orange-600 hidden md:block'><Link to='/contact'>Contact Us</Link></li>



                </ul>
                {/* <ul className='flex gap-3'>
                    <li>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Avatar className="cursor-pointer">
                                <AvatarImage src='https://media.licdn.com/dms/image/D4D03AQEkyA86m-dHEA/profile-displayphoto-shrink_200_200/0/1721067263035?e=2147483647&v=beta&t=FzF1YDT_Y15wEC5EB4MHEoE1VRMuBw4tVw6-IhYDOpo' />
                            </Avatar>
                            </PopoverTrigger>

                            <PopoverContent className='p-3 w-48 bg-white rounded-sm border-black border'>
                                <h1 className='font-bold mt-2'>Hi, Vishwanath</h1>
                                <hr className='my-4'/>
                                <div className='flex flex-col justify-center items-start gap-3'>
                                <div className='flex gap-2'>
                                    <Bookmark/>
                                    <h1 className='font-semibold'>Saved Properties</h1>
                                </div>
                                <div className='flex gap-2 cursor-pointer' onClick={logoutHandler}>
                                    <LogOut/>
                                    <h1 className='font-semibold'>Logout</h1>
                                </div>
                                </div>
                            </PopoverContent>

                        </Popover>

                    </li>
                    <li className='flex items-center'>
                        <Menu size={34} strokeWidth={2.5} />
                    </li>
                </ul> */}
                <ul className='flex gap-3'>
                    <li><Link to='/login'><Button>Login</Button></Link></li>
                    <li><Link to="/signup"><Button variant="outline">Signup</Button></Link></li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar