'use client'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type ButtonProps = {
  className?: string
  title: string
  type?: 'submit' | 'button' | 'reset'
  loading?: boolean
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  onClick?: () => void
}

export default function Button(props: ButtonProps) {
  return (
    <button
      disabled={props.loading || props.disabled}
      type={props.type}
      onClick={props.onClick}
      className={`submit ${props.className} text-nowrap ${props.size === 'small' ? 'h-5 text-sm' : ''}`}
    >
      {props.title}
      {props.loading && <FontAwesomeIcon spin icon={faCircleNotch} />}
    </button>
  )
}
