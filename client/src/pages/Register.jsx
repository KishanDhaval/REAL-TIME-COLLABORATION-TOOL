import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '../hooks/useRegister'
import './auth.css'

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
      <div className="Register-container">
        <div className="form ">
          <h1 className='title'>Sign Up</h1>

          <form onSubmit={handleSubmit} className='form-fields'>
            <input
            className='input '
              type="text"
              name="name"
              id="name"
              required
              placeholder='Name here...'
              onChange={(e) => setName(e.target.value)}
            />
             <input
            className='input '
              type="text"
              name="userName"
              id="userName"
              required
              placeholder='userName here...'
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
            className='input'
              type="email"
              name="email"
              id="email"
              required
              placeholder='email here...'
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
            className='input'
              type="password"
              name="password"
              id="password"
              required
              placeholder='password here...'
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className='btn' type="submit" >Submit</button>

            {/* {error && <div >{error}</div>} */}
          </form>
          <p>Already registered? <Link className='link' to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Register
