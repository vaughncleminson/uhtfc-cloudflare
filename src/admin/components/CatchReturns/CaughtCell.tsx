import type { DefaultServerCellComponentProps } from 'payload'

type CatchStats = {
  largeFish?: number | null
  total?: number | null
  averageLength?: number | null
}

export function CaughtCell({ rowData }: Pick<DefaultServerCellComponentProps, 'rowData'>) {
  const stats = rowData?.stats as CatchStats | null | undefined
  const total = stats?.total ?? (rowData?.stats_total as number | null | undefined) ?? 0
  const largeFish =
    stats?.largeFish ?? (rowData?.stats_large_fish as number | null | undefined) ?? 0
  const averageLength = Math.round(
    stats?.averageLength ?? (rowData?.stats_average_length as number | null | undefined) ?? 0,
  )

  if (total === 0) {
    return <span>nil</span>
  }

  return (
    <span>
      {total} avg {averageLength} cm
      <br />
      largest {largeFish} cm
    </span>
  )
}

export default CaughtCell
