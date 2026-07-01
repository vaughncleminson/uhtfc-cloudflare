import { useState } from 'react'

interface CaretProps {
  open: boolean
  onClick?: () => void
  size?: number
}

export default function Caret({ open, onClick, size = 10 }: CaretProps) {
  return (
    <>
      <div
        onClick={onClick}
        className={`caret ${open ? 'open' : ''}`}
        style={{
          width: size,
          height: size,
        }}
      />

      <style jsx>{`
        .caret {
          border-right: 2px solid white;
          border-bottom: 2px solid white;
          transform: rotate(-45deg);
          transition: transform 0.2s ease;
          cursor: pointer;
          box-sizing: border-box;
        }

        .caret.open {
          transform: rotate(45deg);
        }
      `}</style>
    </>
  )
}
