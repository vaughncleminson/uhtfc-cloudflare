'use client'
import { NavigationType } from '@/frontend/types/navigation'
import { Navigation } from '@/payload-types'
import Link from 'next/link'

import { useEffect, useState } from 'react'
import { useAuth } from '../ui/AuthProvider'

type Props = {
  navigation: Navigation
}
export default function Footer(props: Props) {
  const [mainSections, setMainSections] = useState<NavigationType>(
    props.navigation.navigation as NavigationType,
  )
  const [scrollPosition, setScrollPosition] = useState(0)
  const { user } = useAuth()

  const [showFooter, setShowFooter] = useState(false)

  const handleScroll = () => {
    const scrollTop = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // Allow a small tolerance (10px) for rounding differences
    const atBottom = scrollTop + windowHeight >= documentHeight - 10

    setShowFooter(atBottom)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check on initial render
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  // const [subSections, setSubSections] = useState<NavigationType | null>(null)

  return (
    <footer
      className={`fixed bottom-0 left-0 z-50 w-screen bg-slate-900 px-5 lg:px-40 py-10 flex justify-between transition-transform duration-300 ease-in-out ${
        showFooter ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex flex-col gap-5 text-white uppercase lg:flex-row">
        {mainSections
          .filter((section) => section.title !== 'Profile')
          .map((section, index) => (
            <div key={index}>
              {section.link && (
                <>
                  {section.auth != undefined && section.auth == false && !user && (
                    <Link key={index} href={section.link}>
                      <div className="uppercase text-xl">{section.title}</div>
                    </Link>
                  )}
                  {section.auth != undefined && section.auth == true && user && (
                    <Link key={index} href={section.link}>
                      <div className="uppercase text-xl">{section.title}</div>
                    </Link>
                  )}
                </>
              )}
              {!section.link && (
                <div key={index} className="flex flex-col gap-1 w-36">
                  <div className="uppercase text-xl">{section.title}</div>
                  {section.children?.map((sub) => (
                    <a href={sub.link} key={sub.title} className="uppercase text-slate-400 text-sm">
                      {sub.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
      <div className=" text-white flex flex-col gap-1 text-right">
        <div className="uppercase text-xl">Contact</div>
        <a className="uppercase text-slate-400 text-sm" href="mailto:uhtfc.office@gmail.com">
          uhtfc.office@gmail.com
        </a>
        <a className="uppercase text-slate-400 text-sm" href="tel:0826363985">
          082 636 3985
        </a>
      </div>
      <div className="absolute text-[11px] text-white bottom-2 right-5 lg:right-40">
        © Underberg-Himeville Trout Fishing Club {new Date().getFullYear()}
      </div>
    </footer>
  )
}
