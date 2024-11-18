import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [input, setInput] = useState({
    email: '',
    password: ''
  })

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = {
      email: input.email,
      password: input.password,
    }
    try {
      const response = await axios.post('http://localhost:3001/api/v1/user/login', formData)
      if (response.data.success == true) {
        toast.success(response.data.message)
        navigate('/')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data.message)
    }
  }

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  return (
    <div className='flex justify-center items-center min-h-[70vh]'>
      <div className='flex max-w-7xl flex-col items-center justify-center'>

        <form onSubmit={submitHandler} className=' border border-black p-5 rounded-sm flex flex-col gap-5 shadow-xl '>
          <h1 className='text-3xl text-center font-semibold'>Login</h1>

          <div className='flex w-80 flex-col justify-between gap-4'>
            <Label>Email</Label>
            <Input type='text' value={input.email} onChange={changeEventHandler} name="email" placeholder='example@gmail.com' className='border border-black px-2' />
          </div>
          <div className='flex flex-col justify-between gap-4'>
            <Label>Password</Label>
            <Input type='password' value={input.password} onChange={changeEventHandler} name="password" placeholder='**********' className='border border-black px-2' />
          </div>
          <Button type="submit">Login</Button>
          <div className='flex justify-between'>
          <Link to='/signup' className=''>Not Registered yet?</Link>
          <Link to='/forgot-password' className='underline text-green-500'>Forgot password</Link>
        </div>
        </form>

      </div>

    </div>
  )
}

export default Login