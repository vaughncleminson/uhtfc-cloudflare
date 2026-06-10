import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const POST = async (request: Request) => {
  const data = (await request.json()) as any
  const payload = await getPayload({
    config: configPromise,
  })
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
  try {
    data.role = 'non-member'
    const newUser = await payload.create({
      collection: 'users',
      data,
    })
    return Response.json({ success: true, data: newUser, message: 'Registration Successful' })
  } catch (e) {
    return Response.json({ success: false, data: null, message: 'Registration Error' })
  }
}
