'use client'
import Row from '../layout/Row'

import { Media, OrderBlock } from '@/payload-types'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import OrderForm from '../forms/orderForm'
import Col from '../layout/Col'

export default function Order(props: OrderBlock) {
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
                <OrderForm />
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
