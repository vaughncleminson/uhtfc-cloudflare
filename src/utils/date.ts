import dayjs, { type ConfigType } from 'dayjs'

export const DATE_DISPLAY_FORMAT = 'DD MMM YYYY'
export const DATE_PICKER_DISPLAY_FORMAT = 'dd MMM yyyy'

export const formatDisplayDate = (date: ConfigType): string =>
  dayjs(date).format(DATE_DISPLAY_FORMAT)
