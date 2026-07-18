import { array, z } from 'zod'
import { lineItemSchema } from './lineItemSchema'

export const festivalEntrySchema = z.object({
  teamName: z.string().min(2, 'Team name must be at least 2 characters'),

  // check payload collection festivals
  // column entriesPerTeam

  teamMemberFullNames: array(
    z.string().min(2, 'Team member Full Name must be at least 2 characters'),
  ).min(1, 'At least one team member is required'),
  teamMemberEmails: array(z.string().email('Invalid email address')).min(
    1,
    'At least one team member email is required',
  ),
})
export type FestivalEntry = z.infer<typeof festivalEntrySchema>
