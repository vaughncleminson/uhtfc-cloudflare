// providers/AuthProvider.tsx

'use client'

import { Admin, User } from '@/payload-types'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

type AuthUser = Admin | User | null

const AuthContext = createContext<{ user: AuthUser } | null>(null)

export function AuthProvider({ user, children }: { user: AuthUser; children: React.ReactNode }) {
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState<AuthUser>(user)

  useEffect(() => {
    setCurrentUser(user)
  }, [user])

  useEffect(() => {
    if (!user) return

    const controller = new AbortController()

    const refreshUser = async () => {
      // I know this calls the database on every page load, but it's necessary to keep the user data up-to-date
      // specifically the user.arrearsAmount field, which will block any bookings if > 0
      try {
        const response = await fetch('/api/current-user', {
          cache: 'no-store',
          signal: controller.signal,
        })

        if (!response.ok) return

        const data = (await response.json()) as { user: AuthUser }
        setCurrentUser(data.user)
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Unable to refresh current user', error)
        }
      }
    }

    void refreshUser()

    return () => controller.abort()
  }, [pathname, user])

  return <AuthContext.Provider value={{ user: currentUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
