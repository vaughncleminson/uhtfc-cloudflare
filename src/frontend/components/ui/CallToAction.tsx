'use client'
import { settingsAtom } from '@/frontend/atoms/settingsAtom'
import { useAtom } from 'jotai'

export default function CallToAction() {
  const [settings, setSettings] = useAtom(settingsAtom)
  return (
    <div className="absolute top-5 left-1/2 bg-red-700 transform -translate-x-1/2">
      {settings &&
        settings!.callToAction &&
        settings!.callToAction.link &&
        settings!.callToAction.link.label && (
          <>
            <div className=" text-white">
              <div className={`px-4 py-1 text-center text-white text-sm uppercase`}>
                {settings!.callToAction.link.label}
              </div>
            </div>
          </>
        )}
    </div>
  )
}
