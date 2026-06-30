'use client'
import { Media, MyBookingsBlock, MyCatchReturnsBlock } from '@/payload-types'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Col from '../layout/Col'
import Row from '../layout/Row'
import MyCatchReturnsForm from '../forms/myCatchReturnsForm'

export default function MyCatchReturns(props: MyCatchReturnsBlock) {
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
                <MyCatchReturnsForm />
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
  )
}
