'use client'
import { userAtom } from '@/frontend/atoms/userAtom'
import { NavigationType } from '@/frontend/types/navigation'
import { Navigation } from '@/payload-types'
import { useAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Nav from './Nav'

type Props = {
  navigation: Navigation
  isAuthenticated: boolean
}
export default function Header(props: Props) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [user, setUser] = useAtom(userAtom)
  const handleScroll = () => {
    const position = window.scrollY || document.documentElement.scrollTop
    setScrollPosition(position)
  }

  useEffect(() => {
    window!.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window!.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!props.isAuthenticated) {
      setUser(null)
    }
  }, [props.isAuthenticated])

  const nav = props.navigation.navigation as NavigationType

  return (
    <header
      className={`transform h-[90px] top-0 fixed z-50 flex w-full items-center justify-between py-3  bg-slate-800 ease-in-out transition-all duration-300 px-5 lg:px-40 ${
        scrollPosition < 10 ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center justify-center">
        <div className="relative h-20 w-28">
          <Link href="/" className="relative block h-full w-full">
            <Image
              src="/assets/UHTFC logo.png"
              alt="Logo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 10vw"
            />
          </Link>
        </div>
        {/* <div className={`${charm.className} text-white text-2xl`}>uhtfc</div> */}
      </div>

      <div className="">
        <Nav navigation={nav} isAuthenticated={props.isAuthenticated} />
      </div>
    </header>
  )
}

// const queryNavigation = cache(async () => {
//   const payload = await getPayload({ config: configPromise })

//   const result = await payload.findGlobal({
//     slug: 'navigation',
//   })

//   return result
// })
