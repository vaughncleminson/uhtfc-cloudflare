// providers/AuthProvider.tsx

'use client'

import { Admin, User } from '@/payload-types'
import { createContext, useContext } from 'react'

type AuthUser = Admin | User | null

const AuthContext = createContext<{ user: AuthUser } | null>(null)

export function AuthProvider({ user, children }: { user: AuthUser; children: React.ReactNode }) {
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
