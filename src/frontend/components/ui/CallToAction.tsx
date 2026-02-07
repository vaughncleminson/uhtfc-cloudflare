'use client'
import { settingsAtom } from '@/frontend/atoms/settingsAtom'
import { useAtom } from 'jotai'
import Image from 'next/image'

export default function CallToAction() {
  const [settings, setSettings] = useAtom(settingsAtom)
  return (
    <div className="flex -mt-4">
      {settings &&
        settings!.callToAction &&
        settings!.callToAction.link &&
        settings!.callToAction.link.label && (
          <>
            <div className="relative w-[24px]">
              <Image
                src="/api/media/file/ribbon.png"
                alt="arrow down"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 10vw"
              />
            </div>
            <div className=" text-white bg-red-700">
              <div className={`px-4 py-2 text-2xl text-center `}>
                {settings!.callToAction.link.label}
              </div>
            </div>
            <div className="relative w-[24px] rotate-180">
              <Image
                src="/api/media/file/ribbon.png"
                alt="arrow down"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 10vw"
              />
            </div>
          </>
        )}
    </div>
  )
}
