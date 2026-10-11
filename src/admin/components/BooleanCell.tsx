import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { DefaultServerCellComponentProps } from 'payload'

export function BooleanCell({ cellData }: DefaultServerCellComponentProps) {
  const isTrue = cellData === true
  const label = isTrue ? 'True' : 'False'

  return (
    <span aria-label={label} title={label}>
      <FontAwesomeIcon
        icon={isTrue ? faCheck : faXmark}
        style={{ color: isTrue ? '#15803d' : '#dc2626', width: '1rem' }}
      />
    </span>
  )
}

export default BooleanCell
