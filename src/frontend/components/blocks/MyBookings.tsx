'use client'
import { Media, MyBookingsBlock } from '@/payload-types'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import MyBookingsForm from '../forms/myBookingsForm'
import Col from '../layout/Col'
import Row from '../layout/Row'

export default function MyBookings(props: MyBookingsBlock) {
  const image = props.image as Media
  const formRef = useRef<HTMLDivElement>(null)
  const [formHeight, setFormHeight] = useState<number>(0)
  useEffect(() => {
    if (!formRef.current) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setFormHeight(entry.contentRect.height)
      }
    })

    observer.observe(formRef.current)

    return () => observer.disconnect()
  }, [])
  return (
    <div className="relative w-full z-0">
      <div className="flex flex-col gap-8 z-10 w-full">
        <div className="z-30 w-full">
          <Row>
            <Col>
              <div ref={formRef}>
                <MyBookingsForm />
              </div>
            </Col>

            <Col>
              <div
                className="relative w-full"
                style={{ height: formHeight || 380 }} // fallback
              >
                <Image
                  src={image.url!}
                  alt={image.alt}
                  fill
                  className="shadow-lg object-cover object-center"
                />
                <Image
                  className="absolute inset-0 z-0 object-fill"
                  src="/assets/shade_outer.png"
                  alt="shade"
                  fill
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    // <div className="relative w-full z-0">
    //   <Image
    //     className="fixed z-0 w-screen h-screen top-0 left-0 object-cover object-center"
    //     src={image.url!}
    //     alt={image.alt}
    //     width={2048}
    //     height={2048}
    //   />

    //   <div className="flex flex-col gap-8 z-10 w-full mt-40 mb-10">
    //     <div className="z-50">
    //       <Row>
    //         <div className={`text-white drop-shadow-[0_5px_5px_rgba(0,0,0,1)] ${charm.className}`}>
    //           <h1 className="text-6xl ml-5 -mb-9 lg:ml-20">{props.title}</h1>
    //         </div>
    //       </Row>
    //     </div>
    //     <div className=" z-30 w-full">
    //       <Row>
    //         <MyBookingsForm />
    //       </Row>
    //     </div>
    //     <Link href={'#map'}>
    //       <div className="flex z-20 flex-col cursor-pointer w-full items-center">
    //         <FontAwesomeIcon
    //           className="text-white drop-shadow-[0_5px_5px_rgba(0,0,0,1)] w-5 h-6 animate-pulse"
    //           icon={faAngleDown}
    //         />
    //       </div>
    //     </Link>
    //   </div>
    // </div>
  )
}
