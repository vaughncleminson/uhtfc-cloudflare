import { createFestivalEntrySchema } from '@/frontend/schemas/festivalEntrySchema'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

type FestivalEntryRequest = Record<string, unknown>

const getTrimmedString = (value: unknown): string => {
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return ''
}

//extraMeals is an optional field that can be a string or number. If it's a string, it should be parsed to a number. If it's not a valid number, it should default to 0. It should also be rounded down to the nearest integer.
const parseExtraMeals = (value: unknown): number => {
  const parsed = Number(getTrimmedString(value))
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0
  }

  return Math.floor(parsed)
}

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as FestivalEntryRequest
    console.log('festival-entries POST: body', body)
    const festivalId = getTrimmedString(body.festivalId)

    if (!festivalId) {
      return NextResponse.json(
        { success: false, message: 'festival-entries: Post: festivalId is required' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({
      headers: await headers(),
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'You must be logged in to submit festival entries',
        },
        { status: 401 },
      )
    }

    //confirm that the festival exists and get the entriesPerTeam value
    const festivalResult = await payload.find({
      collection: 'festivals',
      where: {
        id: {
          equals: festivalId,
        },
      },
      limit: 1,
      overrideAccess: true,
    })

    if (festivalResult.totalDocs === 0) {
      return NextResponse.json({ success: false, message: 'Festival not found' }, { status: 404 })
    }

    // validation setup against schema
    const festival = festivalResult.docs[0]
    const entriesPerTeam = Math.max(1, festival.entriesPerTeam ?? 1)
    const validationSchema = createFestivalEntrySchema(entriesPerTeam)
    const validationResult = validationSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid festival entry payload',
          errors: validationResult.error.flatten(),
        },
        { status: 400 },
      )
    }

    // validation of team member sizes against the allowed sizes for the festival's giveaway type
    // first populate allowedSizes
    const selectedGiveAwayType = festival.giveAwayType?.[0]
    const allowedSizesRaw =
      selectedGiveAwayType === 'beanie'
        ? (festival.beanieSizes ?? [])
        : selectedGiveAwayType === 'hat'
          ? (festival.hatSizes ?? [])
          : (festival.garmentSizes ?? [])
    const allowedSizes: string[] = allowedSizesRaw.map((size) => String(size))

    const parsedData = validationResult.data
    const extraMeals = parseExtraMeals(parsedData.extraMeals)

    // build the teamMembers array based on the number of entriesPerTeam,
    // validating each team member's size against the allowed sizes
    const teamMembers = Array.from({ length: entriesPerTeam }).map((_, index) => {
      const fullName = getTrimmedString(parsedData[`teamMember_${index}`])
      const email = getTrimmedString(parsedData[`teamMemberEmail_${index}`]).toLowerCase()
      const mobile = getTrimmedString(parsedData[`teamMemberMobile_${index}`])
      const size = getTrimmedString(parsedData[`teamMemberSize_${index}`])

      if (allowedSizes.length > 0 && !allowedSizes.includes(size)) {
        throw new Error(`Invalid size selected for team member #${index + 1}`)
      }

      return {
        fullName,
        email,
        mobile,
        size,
        ...(index === 0 ? { extraMeals } : {}),
      }
    })

    // if we get here, all validation has passed, and we can create the festival entry
    const createdEntry = await payload.create({
      collection: 'festivalEntries',
      data: {
        productType: 'festivalEntry',
        festival: festival.id,
        teamName: getTrimmedString(parsedData.teamName),
        teamMembers,
      },
      overrideAccess: true,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Festival entry submitted successfully',
        data: createdEntry,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Invalid size selected')) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    console.error('Error submitting festival entry:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit festival entry' },
      { status: 500 },
    )
  }
}
