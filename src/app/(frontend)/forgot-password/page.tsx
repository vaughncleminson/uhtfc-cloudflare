import ForgotPasswordForm from '@/frontend/components/forms/forgotPasswordForm'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto">
        <ForgotPasswordForm />
        <p className="text-center mt-4 text-slate-700">
          <Link className="text-white underline" href="/">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
