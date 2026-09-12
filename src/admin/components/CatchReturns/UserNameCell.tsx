import type { DefaultServerCellComponentProps } from 'payload'

export async function UserNameCell({ cellData, payload }: DefaultServerCellComponentProps) {
  if (typeof cellData !== 'number') {
    return <span>-</span>
  }

  try {
    const user = await payload.findByID({
      collection: 'users',
      id: cellData,
      depth: 0,
      select: {
        firstName: true,
        lastName: true,
      },
    })
    const userName = [user.firstName, user.lastName].filter(Boolean).join(' ')

    return <span>{userName || '-'}</span>
  } catch {
    return <span>-</span>
  }
}

export default UserNameCell
