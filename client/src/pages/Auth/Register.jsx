import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '../../hooks/useRegister'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const  { register } = useRegister()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    await register(name,userName, email, password)
  }
  return (
    <div>
      <div className="register-container flex items-center justify-center flex-col h-[calc(100vh)] bg-zinc-900 text-white">
        <div className="form border border-gray-600 rounded p-5 sm:w-96 w-80">
          <h1 className='text-center text-teal-300 sm:mb-9 mb-5 sm:mt-2 text-3xl'>Sign Up</h1>

          <form onSubmit={handleSubmit} className='flex flex-col gap-3 sm:gap-5'>
            <input
            className='bg-zinc-800 rounded outline-none px-4 py-2 w-full '
              type="text"
              name="name"
              id="name"
              required
              placeholder='Name here...'
              onChange={(e) => setName(e.target.value)}
            />
             <input
            className='bg-zinc-800 rounded outline-none px-4 py-2 w-full '
              type="text"
              name="userName"
              id="userName"
              required
              placeholder='userName here...'
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
            className='bg-zinc-800 rounded outline-none px-4 py-2 w-full'
              type="email"
              name="email"
              id="email"
              required
              placeholder='email here...'
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
            className='bg-zinc-800 rounded outline-none px-4 py-2 w-full'
              type="password"
              name="password"
              id="password"
              required
              placeholder='password here...'
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className='bg-teal-500 px-4 py-2 w-full rounded mb-3 sm:mb-5 ease duration-200 hover:bg-teal-600' type="submit" >Submit</button>

            {/* {error && <div >{error}</div>} */}
          </form>
          <p>Already registered? <Link className='text-teal-300 duration-100 ease hover:text-teal-400' to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Register
