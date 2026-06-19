'use client'
import { Media, TwoColumnTextLeftBlock } from '@/payload-types'
import Image from 'next/image'
import Col from '../layout/Col'
import Row from '../layout/Row'
import RichText from '../layout/RichText'

export default function TwoColumnTextLeft(props: TwoColumnTextLeftBlock) {
  const image = props.image as Media | null | undefined
  const variant = props.variant || 'lightContent'
  const isLightContent = variant === 'lightContent'

  return (
    <div id="two-column-text-left" className="relative w-screen bg-opacity-90">
      <Row className={isLightContent ? 'py-5 items-stretch' : ''}>
        <Col>
          <div
            className={`relative flex flex-col overflow-hidden min-h-[372px] p-5 gap-3 ${
              isLightContent
                ? 'bg-[#f8f6f1] text-slate-800 border border-slate-200 rounded-sm shadow-sm lg:p-8'
                : 'bg-slate-900 text-white text-sm'
            }`}
          >
            {props.title && (
              <h2
                className={`tracking-wide ${
                  isLightContent
                    ? 'text-3xl normal-case font-semibold border-b border-slate-200 pb-3'
                    : 'text-2xl uppercase'
                }`}
              >
                {props.title}
              </h2>
            )}
            <RichText
              className={`w-full ${
                isLightContent
                  ? 'text-slate-700 prose-headings:text-slate-900 prose-p:leading-7'
                  : 'text-slate-200'
              }`}
              data={props.description}
            />
          </div>
        </Col>
        {image?.url && (
          <div className="flex flex-col w-full self-stretch">
            <div
              className={`relative ${
                isLightContent
                  ? 'h-full min-h-[372px] lg:min-h-0 flex flex-col bg-[#f3efe4] border border-slate-200 rounded-sm p-2 shadow-sm'
                  : 'h-[380px]'
              }`}
            >
              <div
                className={`relative w-full ${
                  isLightContent ? 'h-[320px] rounded-[2px] overflow-hidden' : 'h-full'
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || props.title || 'Two column image'}
                  fill
                  className={`object-cover object-center ${isLightContent ? '' : 'shadow-lg h-[386px]'}`}
                />
                {!isLightContent && (
                  <Image
                    className="absolute z-0 h-full top-0 left-0 object-fill"
                    src={'/assets/shade_outer.png'}
                    alt="shade"
                    fill
                    sizes="100vw"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </Row>
    </div>
  )
}
