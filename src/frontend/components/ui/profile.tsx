'use client'

import { userAtom } from '@/frontend/atoms/userAtom'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAtom } from 'jotai'

type Props = {
  isAuthenticated: boolean
}

export default function Profile(props: Props) {
  const [user, setUser] = useAtom(userAtom)

  return (
    <>
      {user && props.isAuthenticated && (
        <div className="bg-black bg-opacity-60 border border-white border-opacity-60 px-4 py-2 flex items-center gap-2">
          <FontAwesomeIcon className="w-4 h-4 opacity-70" icon={faUser} />

          <div className="text-sm opacity-70">
            {user.firstName} ({user.role})
          </div>
        </div>
      )}
    </>
  )
}
