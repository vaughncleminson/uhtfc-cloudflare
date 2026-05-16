'use client'

import { userAtom } from '@/frontend/atoms/userAtom'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'

export default function Logout() {
  const [user, setUser] = useAtom(userAtom)
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
        setUser(null)
        router.push('/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return <div onClick={logout}>Logout</div>
}
