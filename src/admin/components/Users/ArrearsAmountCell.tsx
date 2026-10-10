import type { DefaultServerCellComponentProps } from 'payload'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
})

export function ArrearsAmountCell({ cellData }: DefaultServerCellComponentProps) {
  return typeof cellData === 'number' && cellData > 0 ? (
    <span>R {currencyFormatter.format(cellData)}</span>
  ) : null
}

export default ArrearsAmountCell
