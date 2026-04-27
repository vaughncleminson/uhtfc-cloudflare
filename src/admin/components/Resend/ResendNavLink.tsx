export function ResendNavLink() {
  return (
    <a
      className="nav__link"
      href="/admin/resend"
      style={{
        display: 'block',
        marginTop: '0.5rem',
        padding: '0.35rem 0',
      }}
    >
      <span className="nav__link-label">Resend Email Tester</span>
    </a>
  )
}
