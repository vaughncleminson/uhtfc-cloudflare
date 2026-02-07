'use client'
import { orderAtom } from '@/frontend/atoms/orderAtom'
import { settingsAtom } from '@/frontend/atoms/settingsAtom'
import { NavigationType } from '@/frontend/types/navigation'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAtom } from 'jotai'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Logout from '../ui/logout'
import Profile from '../ui/profile'

type Props = {
  navigation: NavigationType
  isAuthenticated: boolean
}

export default function Nav(props: Props) {
  const [mainSections, setMainSections] = useState<NavigationType>(props.navigation)
  const [subSections, setSubSections] = useState<NavigationType | null>(null)
  const [subSubSections, setSubSubSections] = useState<NavigationType | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showNav, setShowNav] = useState<boolean>(false)
  const [settings, setSettings] = useAtom(settingsAtom)
  const [order, setOrder] = useAtom(orderAtom)

  const getSubSection = (index: number) => {
    if (mainSections[index].children?.length) {
      setSelectedIndex(index)
      setSubSections(mainSections[index].children)
    } else {
      setSubSections(null)
    }
  }

  useEffect(() => {
    getSettings()
  }, [])

  const getSettings = async () => {
    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/globals/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await req.json()
      console.log(data)
      if (data) {
        setSettings(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const renderDesktopNav = () => {
    return (
      <>
        <div className="flex items-center gap-4 text-white">
          {mainSections?.map((section, index) => (
            <div
              key={section.title}
              onClick={() => {
                getSubSection(index)
                setShowNav(true)
              }}
            >
              {section.title === 'Profile' ? (
                <Profile isAuthenticated={props.isAuthenticated} />
              ) : (
                section.title
              )}
            </div>
          ))}
          {order?.products && order?.products.length > 0 && (
            <Link href="/checkout">
              <div className="bg-black bg-opacity-60 border border-white border-opacity-60 px-4 h-[38px] flex items-center gap-2 relative">
                <FontAwesomeIcon className="w-4 h-4" icon={faCartShopping} />
                <div className="absolute flex items-center justify-center border border-white px-1 h-4 bg-red-700 text-white -top-2 -right-2 text-xs">
                  {order?.products.length}
                </div>
              </div>
            </Link>
          )}
        </div>
        {showNav && (
          <div
            onClick={() => setShowNav(false)}
            className="absolute top-28 bg-slate-800 bg-opacity-70 text-white w-full p-5"
          >
            {subSections && (
              <div>
                {subSections?.map((subSec) => (
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
          <div
            onClick={() => setShowNav(showNav ? false : true)}
            className="w-10 h-10 bg-white absolute right-10 top-7"
          ></div>
          {showNav && (
            <div className="pt-28 px-10">
              {mainSections?.map((section, index) => (
                <div
                  className="cursor-pointer"
                  key={section.title}
                  onClick={() => getSubSection(index)}
                >
                  <div className="text-xl">{section.title}</div>
                  <div>
                    {subSections && selectedIndex == index && (
                      <div>
                        {subSections?.map((subSec) => (
                          <div className="pl-3 text-base" key={subSec.title}>
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
        <Link className="underline" href={obj.link}>
          {obj.title}
        </Link>
      )
    } else {
      return <div>{obj.title}</div>
    }
  }

  return (
    <nav>
      <div>{renderDesktopNav()}</div>
      {/* <div>{renderMobileNav()}</div> */}
    </nav>
  )
}
