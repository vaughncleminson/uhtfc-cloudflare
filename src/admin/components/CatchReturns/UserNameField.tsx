import { FieldLabel } from '@payloadcms/ui'
import type { UIFieldServerComponent } from 'payload'

export const UserNameField: UIFieldServerComponent = async ({ payload, siblingData }) => {
  const userId = siblingData?.userId
  let userName = '-'

  if (typeof userId === 'number') {
    try {
      const user = await payload.findByID({
        collection: 'users',
        id: userId,
        depth: 0,
        select: {
          firstName: true,
          lastName: true,
        },
      })

      userName = [user.firstName, user.lastName].filter(Boolean).join(' ') || '-'
    } catch {
      userName = '-'
    }
  }

  return (
    <div className="field-type">
      <FieldLabel label="User Name" />
      <div>{userName}</div>
    </div>
  )
}

export default UserNameField
