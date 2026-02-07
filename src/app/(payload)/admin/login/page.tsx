import MFALoginForm from '@/admin/components/MFALoginForm/MFALoginForm'

import './custom.scss'

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-form">
        <MFALoginForm />
      </div>
    </div>
  )
}
