'use client'

import { userAtom } from '@/frontend/atoms/userAtom'
import { useAtom } from 'jotai'

type Props = {
  isAuthenticated: boolean
}

export default function Profile(props: Props) {
  const [user, setUser] = useAtom(userAtom)

  return (
    <>
      {user && props.isAuthenticated && (
        <div className="bg-black bg-opacity-60 border border-white border-opacity-60 px-2 py-1 flex items-center gap-2">
          <div className="text-sm uppercase">
            {user.firstName} ({user.role})
          </div>
        </div>
      )}
    </>
  )
}
