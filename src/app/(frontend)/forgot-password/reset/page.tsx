import ResetPasswordForm from '@/frontend/components/forms/resetPasswordForm'
import Link from 'next/link'
import { Suspense } from 'react'

export default function ResetPasswordPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto">
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
        <p className="text-center mt-4 text-slate-700">
          <Link className="text-white underline" href="/">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
