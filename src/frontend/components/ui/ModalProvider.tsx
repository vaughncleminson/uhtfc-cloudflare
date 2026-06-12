'use client'

import { useRouter } from 'next/navigation'
import { createContext, ReactNode, useContext, useState } from 'react'
import Button from './Button'

type ConfirmOptions = {
  title?: string
  message: string

  cancelTitle?: string
  confirmTitle?: string

  cancelUrl?: string
  confirmUrl?: string

  showCancelButton?: boolean
}

type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextType | null>(null)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null)

  const confirm = (options: ConfirmOptions) => {
    setOptions({
      showCancelButton: true,
      ...options,
    })

    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve)
    })
  }

  const handleClose = (result: boolean) => {
    resolver?.(result)
    setResolver(null)
    setOptions(null)
  }

  const handleCancel = () => {
    if (options?.cancelUrl) {
      router.push(options.cancelUrl)
    }

    handleClose(false)
  }

  const handleConfirm = () => {
    if (options?.confirmUrl) {
      router.push(options.confirmUrl)
    }

    handleClose(true)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {options && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-md bg-slate-700 p-6">
            <h2 className="text-lg font-semibold uppercase text-white">
              {options.title ?? 'Confirm'}
            </h2>

            <p className="mt-3 text-center text-white">{options.message}</p>

            <div className="mt-6 flex gap-3">
              {options.showCancelButton && (
                <Button
                  className="w-full bg-slate-800 hover:bg-slate-900"
                  title={options.cancelTitle ?? 'Cancel'}
                  onClick={handleCancel}
                />
              )}

              <Button
                className="w-full"
                title={options.confirmTitle ?? 'Continue'}
                onClick={handleConfirm}
              />
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const context = useContext(ConfirmContext)

  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider')
  }

  return context.confirm
}
