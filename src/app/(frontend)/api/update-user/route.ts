import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

export const POST = async (request: Request) => {
  const data = (await request.json()) as any
  const payload = await getPayload({
    config: configPromise,
  })

  const { user } = await payload.auth({
    headers: await headers(),
  })

  const originalUser = await payload.findByID({ collection: 'users', id: user.id })
  if (!originalUser) {
    return Response.json({ success: false, data: null, message: 'User not found' })
  }
  //then check if the email is being updated and if so, check if the new email already exists for another user
  if (data.email && data.email !== originalUser.email) {
    const user = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: data.email,
        },
      },
    })
    if (user.docs.length) {
      return Response.json({ success: false, data: null, message: 'User already exists' })
    }
  }
  //update the user with the new data
  const updatedUser = await payload.update({
    collection: 'users',
    id: user.id,
    data,
  })
  if (updatedUser) {
    return Response.json({ success: true, data: updatedUser, message: 'Profile Update Successful' })
  } else {
    return Response.json({ success: false, data: null, message: 'Profile Update Failed' })
  }
}
