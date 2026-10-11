import type { DefaultServerCellComponentProps } from 'payload'

type CatchStats = {
  largeFish?: number | null
  total?: number | null
}

export function CaughtCell({ rowData }: DefaultServerCellComponentProps) {
  const stats = rowData.stats as CatchStats | null | undefined
  const total = stats?.total ?? 0

  if (total === 0) {
    return
  }

  return <span>{`${total}, largest ${stats?.largeFish ?? 0}`}</span>
}

export default CaughtCell
