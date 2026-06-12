import type { JobsConfig } from 'payload'

import { tasks } from '../tasks'

export const jobs: JobsConfig = {
  // Keep completed job records so run history is visible in admin
  autoRun: [
    {
      cron: '*/5 * * * *', // Check every 5 minutes
      queue: 'default',
    },
  ],

  deleteJobOnComplete: false,
  jobsCollectionOverrides: ({ defaultJobsCollection }) => {
    const updateLogField = (fields: any[] = []): any[] =>
      fields.map((field) => {
        if (field?.name === 'log') {
          return {
            ...field,
            label: 'Note',
            admin: {
              ...field.admin,
              components: {
                ...field.admin?.components,
                Cell: '@/admin/components/Jobs/noteCell#JobsNoteCell',
              },
            },
          }
        }

        if (field?.type === 'tabs' && Array.isArray(field.tabs)) {
          return {
            ...field,
            tabs: field.tabs.map((tab: any) => ({
              ...tab,
              fields: updateLogField(tab.fields || []),
            })),
          }
        }

        if (Array.isArray(field?.fields)) {
          return {
            ...field,
            fields: updateLogField(field.fields),
          }
        }

        return field
      })

    const fields = updateLogField(defaultJobsCollection.fields as any[])

    return {
      ...defaultJobsCollection,
      fields,
      admin: {
        ...defaultJobsCollection.admin,
        hidden: false,
        defaultColumns: ['taskSlug', 'queue', 'hasError', 'createdAt', 'log'],
        components: {
          ...defaultJobsCollection.admin?.components,
          beforeListTable: [
            ...(defaultJobsCollection.admin?.components?.beforeListTable || []),
            '@/admin/components/Jobs/triggerNow#TriggerCatchReturnJobButton',
            '@/admin/components/Jobs/quickFilters#JobsQuickFilters',
          ],
        },
      },
    }
  },
  tasks, // Tasks are defined in separate files in the /src/admin/tasks directory

  // On Cloudflare Workers, scheduled jobs are triggered by the worker's
  // scheduled() handler instead of Payload's in-process autoRun cron.
  // See https://developers.cloudflare.com/workers/configuration/cron-triggers/
}
