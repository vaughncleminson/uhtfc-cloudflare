'use client'

import { useRouter } from 'next/navigation'

export default function Logout() {
  const router = useRouter()
  const logout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
      const result = await response.json()
      if (result) {
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return <div onClick={logout}>Logout</div>
}
