'use client'
import { userAtom } from '@/frontend/atoms/userAtom'
import { NavigationType } from '@/frontend/types/navigation'
import { Navigation } from '@/payload-types'
import { useAtom } from 'jotai'

import { useEffect, useState } from 'react'

type Props = {
  navigation: Navigation
  isAuthenticated: boolean
}
export default function Footer(props: Props) {
  const [user, setUser] = useAtom(userAtom)
  const [mainSections, setMainSections] = useState<NavigationType>(
    props.navigation.navigation as NavigationType,
  )
  const [subSections, setSubSections] = useState<NavigationType | null>(null)

  useEffect(() => {
    if (!props.isAuthenticated) {
      setUser(null)
    }
  }, [props.isAuthenticated])

  return (
    <footer className="relative w-screen bg-slate-900 px-5 lg:px-40 py-10 flex justify-between mt-5">
      <div className="flex flex-col gap-5 text-white uppercase lg:flex-row">
        {mainSections
          .filter((section) => section.title !== 'Profile')
          .map((section) => (
            <div className="flex flex-col gap-1 w-36" key={section.title}>
              <div className="uppercase text-xl">{section.title}</div>
              {section.children?.map((sub) => (
                <a href={sub.link} key={sub.title} className="uppercase text-slate-400 text-sm">
                  {sub.title}
                </a>
              ))}
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
