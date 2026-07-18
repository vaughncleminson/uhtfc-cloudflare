import { z } from 'zod'

const emailSchema = z.string().email('Invalid email address')

const getTrimmedString = (value: unknown) => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

export const createFestivalEntrySchema = (entriesPerTeam: number) => {
  const safeEntriesPerTeam = Math.max(1, entriesPerTeam)

  return z
    .object({
      teamName: z.string().trim().min(2, 'Team name must be at least 2 characters'),
      extraMeals: z.string().optional(),
    })
    .catchall(z.unknown())
    .superRefine((data, ctx) => {
      // Validate team members. All fields are required for each team member.
      // Loop through the number of team members based on entriesPerTeam
      // all possible team member slots for a festival entry must be filled
      // so if entriesPerTeam is 3, then teamMember_0, teamMember_1, and teamMember_2 must all be filled out with valid data
      for (let index = 0; index < safeEntriesPerTeam; index += 1) {
        const fullNameField = `teamMember_${index}`
        const emailField = `teamMemberEmail_${index}`
        const mobileField = `teamMemberMobile_${index}`
        const sizeField = `teamMemberSize_${index}`

        const fullName = getTrimmedString(data[fullNameField])
        if (fullName.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [fullNameField],
            message: 'Team member Full Name must be at least 2 characters',
          })
        }

        const email = getTrimmedString(data[emailField])
        if (email.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [emailField],
            message: 'Team member Email is required',
          })
        } else if (!emailSchema.safeParse(email).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [emailField],
            message: 'Invalid email address',
          })
        }

        const mobile = getTrimmedString(data[mobileField])
        if (mobile.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [mobileField],
            message: 'Team member Mobile Number is required',
          })
        }

        const size = getTrimmedString(data[sizeField])
        if (size.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [sizeField],
            message: 'Team member size is required',
          })
        }
      }
    })
}

export type FestivalEntry = z.infer<ReturnType<typeof createFestivalEntrySchema>>
