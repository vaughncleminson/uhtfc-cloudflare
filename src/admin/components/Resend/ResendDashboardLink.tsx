import { Card } from '@payloadcms/ui'

export function ResendDashboardLink() {
  return (
    <div className="collections__group">
      <h2 className="collections__label">Email Tools</h2>
      <ul className="collections__card-list">
        <li>
          <Card
            buttonAriaLabel="Open Resend Email Tester"
            href="/admin/resend"
            title="Resend Email Tester"
            titleAs="h3"
          />
        </li>
      </ul>
    </div>
  )
}
