'use client'
import { orderAtom } from '@/frontend/atoms/orderAtom'
import { settingsAtom } from '@/frontend/atoms/settingsAtom'
import { NavigationType } from '@/frontend/types/navigation'
import { useAtom } from 'jotai'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../ui/AuthProvider'
import Caret from '../ui/Caret'
import HamburgerButton from '../ui/Hamburger'
import Logout from '../ui/logout'
import Profile from '../ui/profile'

type Props = {
  navigation: NavigationType
}

export default function Nav(props: Props) {
  const [mainSections, setMainSections] = useState<NavigationType>(props.navigation)
  const [subSections, setSubSections] = useState<NavigationType | null>(null)
  const [subSubSections, setSubSubSections] = useState<NavigationType | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showNav, setShowNav] = useState<boolean>(false)
  const [settings, setSettings] = useAtom(settingsAtom)
  const [order, setOrder] = useAtom(orderAtom)
  const { user } = useAuth()
  const navRef = useRef<HTMLDivElement>(null)

  const getSubSection = (index: number) => {
    if (mainSections[index].children?.length) {
      setSelectedIndex(index)
      setSubSections(mainSections[index].children)
    } else {
      setSubSections(null)
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showNav && navRef.current && !navRef.current.contains(event.target as Node)) {
        setShowNav(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showNav])

  useEffect(() => {
    getSettings()
  }, [])

  const getSettings = async () => {
    try {
      const req = await fetch(`/api/globals/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = (await req.json()) as any
      console.log(data)
      if (data) {
        setSettings(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const isLinkAndAuthenticated = (obj: {
    title: string
    link?: string
    auth?: boolean
    index: number
  }): React.ReactNode => {
    if (obj.link) {
      if (obj.auth && user) {
        return (
          <Link className="hover:text-slate-300" href={obj.link}>
            {obj.title}
          </Link>
        )
      } else if (!obj.auth && !user) {
        return (
          <Link className="hover:text-slate-300" href={obj.link}>
            {obj.title}
          </Link>
        )
      }
    } else if (!obj.link) {
      if (obj.auth && user) {
        return (
          <div
            className="hover:text-slate-300 cursor-pointer"
            key={obj.title}
            onClick={() => {
              getSubSection(obj.index)
              setShowNav(true)
            }}
          >
            {obj.title === 'Profile' ? <Profile /> : obj.title}
          </div>
        )
      } else if (!obj.auth && !user) {
        return (
          <div
            className="hover:text-slate-300 cursor-pointer"
            key={obj.title}
            onClick={() => {
              getSubSection(obj.index)
              setShowNav(true)
            }}
          >
            {obj.title === 'Profile' ? <Profile /> : obj.title}
          </div>
        )
      } else {
        return (
          <div
            key={obj.title}
            onClick={() => {
              getSubSection(obj.index)
              setShowNav(true)
            }}
          >
            {obj.title === 'Profile' ? <Profile /> : obj.title}
          </div>
        )
      }
    }
  }

  const isLinkAndAuthenticatedMobile = (obj: {
    title: string
    link?: string
    auth?: boolean
    index: number
    children?: NavigationType
  }): React.ReactNode => {
    if (obj.link) {
      if (obj.auth && user) {
        return (
          <Link onClick={() => setShowNav(false)} href={obj.link}>
            <div className={`${subSections ? 'text-slate-400 text-2xl' : 'text-2xl'}`}>
              {obj.title}
            </div>
          </Link>
        )
      } else if (!obj.auth && !user) {
        return (
          <Link onClick={() => setShowNav(false)} href={obj.link}>
            <div className={`${subSections ? 'text-slate-400 text-2xl' : 'text-2xl'}`}>
              {obj.title}
            </div>
          </Link>
        )
      }
    } else if (!obj.link) {
      if (obj.auth && user) {
        return (
          <>
            <div className={`${subSections ? 'text-slate-400 text-2xl' : 'text-2xl'}`}>
              {obj.title}
            </div>
            {obj.children && obj.children.length > 0 && (
              <Caret open={selectedIndex === obj.index} />
            )}
          </>
        )
      } else if (obj.auth && !user) {
        return null
      } else {
        return (
          <>
            <div className={`${subSections ? 'text-slate-400 text-2xl' : 'text-2xl'}`}>
              {obj.title}
            </div>
            {obj.children && obj.children.length > 0 && (
              <Caret open={selectedIndex === obj.index} />
            )}
          </>
        )
      }
    }
  }

  const renderDesktopNav = () => {
    return (
      <>
        <div className="flex items-center gap-4 text-white">
          {mainSections?.map((section, index) => (
            <React.Fragment key={section.title}>
              {isLinkAndAuthenticated({ ...section, index })}
            </React.Fragment>
          ))}
          {order?.products && order?.products.length > 0 && user && (
            <Link href="/checkout">
              <div className="bg-black text-sm bg-opacity-60 border border-white border-opacity-60 px-2 py-1 flex items-center gap-2 relative uppercase">
                <div className="text-sm">Cart</div>
                <div className="absolute flex items-center justify-center border border-white border-opacity-60 px-1 h-4 bg-red-700 text-white -top-2 -right-2 text-xs">
                  {order?.products.length}
                </div>
              </div>
            </Link>
          )}
        </div>
        {showNav && (
          <div className="absolute top-20 bg-slate-800 bg-opacity-70 text-white w-full p-5">
            {subSections && (
              <div>
                {subSections.map((subSec) => (
                  <div key={subSec.title}>
                    {subSec.title === 'Logout' ? <Logout /> : renderTitleOrLink(subSec)}

                    <div>
                      {subSec.children?.map((subSubSec) => (
                        <div key={subSubSec.title}>{renderTitleOrLink(subSubSec)}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </>
    )
  }
  const renderMobileNav = () => {
    return (
      <>
        <div className="fixed top-0 left-0 w-screen">
          <div className=" absolute right-10 top-7 flex items-center gap-4 text-white">
            <HamburgerButton open={showNav} size={30} onClick={() => setShowNav(!showNav)} />
            {order?.products && order?.products.length > 0 && user && (
              <Link href="/checkout">
                <div className="bg-black text-sm bg-opacity-60 border border-white border-opacity-60 px-2 py-1 flex items-center gap-2 relative uppercase">
                  <div className="text-sm">Cart</div>
                  <div className="absolute flex items-center justify-center border border-white border-opacity-60 px-1 h-4 bg-red-700 text-white -top-2 -right-2 text-xs">
                    {order?.products.length}
                  </div>
                </div>
              </Link>
            )}
          </div>

          {showNav && (
            <div className="absolute top-[90px] w-full right-0 px-20 py-10 bg-slate-700 text-white">
              {mainSections?.map((section, index) => (
                <div
                  className="cursor-pointer"
                  key={section.title}
                  onClick={() => {
                    getSubSection(index)
                  }}
                >
                  <div className="text-2xl py-1 flex items-center justify-between">
                    <React.Fragment key={section.title}>
                      {isLinkAndAuthenticatedMobile({
                        ...section,
                        index,
                        children: section.children,
                      })}
                    </React.Fragment>
                  </div>
                  <div>
                    {subSections && selectedIndex == index && (
                      <div>
                        {subSections?.map((subSec) => (
                          <div className="pl-3 py-1 text-xl" key={subSec.title}>
                            {renderTitleOrLink(subSec)}
                            <div>
                              {subSec.children?.map((subSubSec) => (
                                <div className="pl-3 text-sm" key={subSubSec.title}>
                                  {' '}
                                  {renderTitleOrLink(subSubSec)}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    )
  }

  const renderTitleOrLink = (obj: { title: string; link?: string }) => {
    if (obj.link) {
      return (
        <Link
          onClick={() => setShowNav(false)}
          className="hover:text-slate-300 cursor-pointer"
          href={obj.link}
        >
          {obj.title}
        </Link>
      )
    } else {
      return <div className="hover:text-slate-300 cursor-pointer">{obj.title}</div>
    }
  }

  return (
    <nav>
      <div ref={navRef} className="hidden md:block">
        {renderDesktopNav()}
      </div>
      <div ref={navRef} className="block md:hidden">
        {renderMobileNav()}
      </div>
    </nav>
  )
}
