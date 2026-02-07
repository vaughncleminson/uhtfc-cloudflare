// lib/toast.tsx
'use client'

import {
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnimatePresence, motion } from 'framer-motion'
import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

type ToastMessage = {
  id: number
  type: ToastType
  message: string
}

const ToastContext = createContext<{
  toast: {
    success: (msg: string) => void
    error: (msg: string) => void
    warning: (msg: string) => void
    info: (msg: string) => void
  }
} | null>(null)

let counter = 0

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = counter++
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const toast = {
    success: (msg: string) => showToast('success', msg),
    error: (msg: string) => showToast('error', msg),
    warning: (msg: string) => showToast('warning', msg),
    info: (msg: string) => showToast('info', msg),
  }

  const icons: Record<ToastType, any> = {
    success: faCheckCircle,
    error: faTimesCircle,
    warning: faExclamationTriangle,
    info: faInfoCircle,
  }

  const colors: Record<ToastType, string> = {
    success: 'bg-lime-700',
    error: 'bg-red-700',
    warning: 'bg-amber-600',
    info: 'bg-sky-800',
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 space-y-2 z-50">
        <AnimatePresence>
          {toasts.map(({ id, type, message }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className={`flex items-center gap-3 px-5 py-4 bg shadow-md text-white ${colors[type]}`}
            >
              <FontAwesomeIcon icon={icons[type]} className="w-5 h-5" />
              <span>{message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context.toast
}
