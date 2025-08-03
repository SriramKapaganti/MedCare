import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { LuStethoscope } from "react-icons/lu";

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await axios.post('https://medcare-1525.onrender.com/login', form)


      Cookies.set('user_name', res.data.name)

      navigate('/')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  useEffect(() => {
  const checkAuth = async () => {
    try {
      await axios.get("https://medcare-1525.onrender.com/verify-token", {
        withCredentials: true,
      })
      navigate("/")
    } catch (err) {
    }
  }
  checkAuth()
}, [navigate])

  return (
    
<div class="bg-black  flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 h-lvh">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <LuStethoscope class="mx-auto h-10 w-auto text-white" />
    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Sign in to your account</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white rounded-lg h-96 inset-shadow-sm shadow-gray-500 p-[25px] h-auto">
    <form action="#" onSubmit={handleSubmit} method="POST" class="space-y-6 rounded-sm h-96 p-[50px]">
      <div>
        <label for="email" class="block text-sm/6 font-medium text-black-100">Email address</label>
        <div class="mt-2">
          <input id="email" type="email" onChange={handleChange} name="email" required autocomplete="email" class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black border border-black outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm/6 font-medium text-black-100">Password</label>
          <div class="text-sm">
          </div>
        </div>
        <div class="mt-2">
          <input id="password" type="password" onChange={handleChange} name="password" required autocomplete="current-password" class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black border border-black outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <button type="submit"  class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign in</button>
      </div>
      <div>
        <button type="button" onClick={() => navigate("/signup")} class="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign up</button>
      </div>
      <div>
        {error && <p className='text-sm font-bold text-center text-red-400'>{error}</p>}
      </div>
    </form>
  </div>
</div>

  )
}

export default Login
