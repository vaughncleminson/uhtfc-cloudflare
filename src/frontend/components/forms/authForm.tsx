'use client'
import { useState } from 'react'
import LoginForm from './loginForm'
import RegisterForm from './registerForm'

export default function AuthForm() {
  const [authType, setAuthType] = useState('login')
  return (
    <>
      {authType == 'login' ? (
        <LoginForm setAuthType={(e) => setAuthType(e)} />
      ) : (
        <RegisterForm setAuthType={(e) => setAuthType(e)} />
      )}
      <p className="text-center mt-2 text-gray-700">
        <span onClick={() => setAuthType('login')} className="underline cursor-pointer">
          Login
        </span>{' '}
        or{' '}
        <span onClick={() => setAuthType('register')} className="underline cursor-pointer">
          Register
        </span>{' '}
        to book water or become a member
      </p>
    </>
  )
}
