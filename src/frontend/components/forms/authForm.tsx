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
    </>
  )
}
