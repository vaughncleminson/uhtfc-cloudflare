import type { TaskConfig } from 'payload'

import { emailCatchReturnLinksTask } from './emailCatchReturnLinks'

export const tasks: TaskConfig<any>[] = [emailCatchReturnLinksTask]
