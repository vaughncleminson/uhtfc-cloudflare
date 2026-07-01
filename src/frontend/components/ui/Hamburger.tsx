interface HamburgerButtonProps {
  open: boolean
  onClick?: () => void
  size?: number
}

export default function HamburgerButton({ open, onClick, size = 24 }: HamburgerButtonProps) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className={`hamburger ${open ? 'open' : ''}`}
        style={{
          width: size,
          height: size,
        }}
      >
        <span />
        <span />
        <span />
      </button>

      <style jsx>{`
        .hamburger {
          position: relative;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .hamburger span {
          position: absolute;
          width: 100%;
          height: 2px;
          background: white;
          border-radius: 2px;
          transition:
            transform 0.25s ease,
            opacity 0.25s ease;
        }

        .hamburger span:nth-child(1) {
          transform: translateY(-10px);
        }

        .hamburger span:nth-child(2) {
          transform: translateY(0);
        }

        .hamburger span:nth-child(3) {
          transform: translateY(10px);
        }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg);
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg);
        }
      `}</style>
    </>
  )
}
