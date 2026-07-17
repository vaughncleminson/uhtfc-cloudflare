import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const POST = async (request: Request) => {
  const data = (await request.json()) as any
  const payload = await getPayload({
    config: configPromise,
  })
  // find if a entry in the users collection already exists with the email provided
  // if a user exists, then check if the uuid provided matches
  // a resetUuid for that user in the previousUsers collection
  let bUserAlreadyExists: boolean = false
  const user = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: data.email,
      },
    },
  })
  if (user.docs.length) {
    bUserAlreadyExists = true
  }
  // if we have a uuid sent, then we need to check if the uuid matches a resetUuid
  // for that email address in the previousUsers collection
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
      // if we have a previous user row, and the reset flag is false,
      // then we can onboard the user, copying the role from the previous user,
      // and set the reset flag to true on the previous user row so that the uuid cannot be used again
      if (previousUser.docs.length && !previousUser.docs[0].reset) {
        await payload.update({
          collection: 'previousUsers',
          id: previousUser.docs[0].id,
          data: {
            reset: true,
          },
        })
        data.role = previousUser.docs[0].role
        // if we already have a user with that email, then we need to update that user with the new data,
        // otherwise we create a new user
        if (bUserAlreadyExists) {
          // update the user with the new data
          const updatedUser = await payload.update({
            collection: 'users',
            id: user.docs[0].id,
            data,
          })
          if (updatedUser) {
            return Response.json({
              success: true,
              data: updatedUser,
              message: 'Onboard Successful',
            })
          } else {
            return Response.json({ success: false, data: null, message: 'Onboard Failed' })
          }
        }
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
  // if we get here, we didn't get a uuid, or the uuid didn't match a previous user
  // if the user already exists, then we update the user with the new data
  if (bUserAlreadyExists) {
    //update the user with the new data
    const updatedUser = await payload.update({
      collection: 'users',
      id: user.docs[0].id,
      data,
    })
    if (updatedUser) {
      return Response.json({ success: true, data: updatedUser, message: 'Onboard Successful' })
    } else {
      return Response.json({ success: false, data: null, message: 'Onboard Error' })
    }
  }
  // otherwise we create a new user with default role of non-member, and return the new user
  try {
    data.role = 'non-member'
    const newUser = await payload.create({
      collection: 'users',
      data,
    })
    return Response.json({ success: true, data: newUser, message: 'Onboard Successful' })
  } catch (e) {
    return Response.json({ success: false, data: null, message: 'Onboard Error' })
  }
}
