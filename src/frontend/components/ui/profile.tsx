'use client'

import { User } from '@/payload-types'
import { useAuth } from './AuthProvider'

export default function Profile() {
  const { user } = useAuth() as { user: User }

  return (
    <>
      {user && (
        <div className="bg-black bg-opacity-60 border border-white border-opacity-60 px-2 py-1 flex items-center gap-2">
          <div className="text-sm uppercase" id="profile-name">
            {user.firstName} ({user.role})
          </div>
        </div>
      )}
    </>
  )
}
