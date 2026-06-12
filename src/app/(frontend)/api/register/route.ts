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
  if (data.uuid) {
    try {
      const previousUser = await payload.find({
        collection: 'previousUsers',
        where: {
          and: [
            {
              email: {
                equals: data.email.trim().toLowerCase(),
              },
            },
            {
              resetUuid: {
                equals: data.uuid,
              },
            },
          ],
        },
      })
      if (previousUser.docs.length && !previousUser.docs[0].reset) {
        await payload.update({
          collection: 'previousUsers',
          id: previousUser.docs[0].id,
          data: {
            reset: true,
          },
        })
        data.role = previousUser.docs[0].role
        const newUser = await payload.create({
          collection: 'users',
          data,
        })
        return Response.json({ success: true, data: newUser, message: 'Onboard Successful' })
      }
    } catch (e) {
      return Response.json({ success: false, data: null, message: 'Onboard Error' })
    }
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
