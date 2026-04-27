import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { ResendForm } from './ResendForm'

export default function ResendView(props: AdminViewServerProps) {
  const visibleEntities = props.visibleEntities ?? { collections: [], globals: [] }

  return (
    <DefaultTemplate
      i18n={props.i18n}
      locale={props.locale}
      params={props.params}
      payload={props.payload}
      permissions={props.permissions}
      searchParams={props.searchParams}
      user={props.user}
      visibleEntities={visibleEntities}
      viewType={props.viewType}
    >
      <Gutter>
        <ResendForm
          defaultFromAddress={process.env.EMAIL_FROM || 'admin@uhtfc.org.za'}
          emailMode={process.env.EMAIL_MODE || 'test'}
          emailTestAddress={process.env.EMAIL_TEST_ADDRESS || ''}
        />
      </Gutter>
    </DefaultTemplate>
  )
}
