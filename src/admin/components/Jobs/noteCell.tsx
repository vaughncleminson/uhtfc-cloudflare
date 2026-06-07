type JobLogEntry = {
  output?: {
    note?: unknown
    [key: string]: unknown
  } | null
  [key: string]: unknown
}

type JobsNoteCellProps = {
  cellData?: unknown
}

export function JobsNoteCell({ cellData }: JobsNoteCellProps) {
  if (!Array.isArray(cellData) || cellData.length === 0) {
    return <span>-</span>
  }

  for (let i = cellData.length - 1; i >= 0; i -= 1) {
    const entry = cellData[i] as JobLogEntry
    const note = entry?.output && typeof entry.output === 'object' ? entry.output.note : undefined

    if (typeof note === 'string' && note.trim().length > 0) {
      return <span title={note}>{note}</span>
    }
  }

  return <span>-</span>
}

export default JobsNoteCell
