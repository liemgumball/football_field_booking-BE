import EnvVars from '@src/constants/EnvVars'

// FIXME environment variables
export function getNextHour(from = new Date()) {
  const nextHour = new Date(from)
  nextHour.setHours(nextHour.getHours() + 1)
  return nextHour
}

// Tomorrow // FIXME environment variables
export function getTomorrow(from = new Date()) {
  const tomorrow = new Date(from)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setUTCHours(23, 59, 59, 0)
  return tomorrow
}

// NextWeek // FIXME environment variables search range
export function getNextWeek(from = new Date()) {
  const nextWeek = new Date(from)
  nextWeek.setDate(nextWeek.getDate() + 7)
  nextWeek.setUTCHours(23, 59, 59, 0)
  return nextWeek
}

// Next Month // FIXME environment variables
export function getNextMonth(from = new Date()) {
  const nextMonth = new Date(from)
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  nextMonth.setUTCHours(23, 59, 59, 0)
  return nextMonth
}

export function getExpireDate(from = getAutoGenerateDate()) {
  const date = new Date(from)
  date.setDate(date.getDate() + EnvVars.Rules.DayOfService.expireDays)
  date.setHours(0, 0) // expires at midnight of local time
  return date
}

export function getAutoGenerateDate() {
  const date = new Date()
  date.setDate(date.getDate() + EnvVars.Rules.DayOfService.rangeDays)
  date.setHours(0, 0, 0, 0)
  return date
}

/**
 * Get list of dates
 * @param {Date} from - Date from (not including)
 * @param {Date} to - Date to (including)
 */
export function getDateList(from: Date, to: Date): Date[] {
  const dateList = []
  const currentDate = new Date(from) // Start with the next day from 'from'
  currentDate.setHours(0, 0, 0, 0)
  currentDate.setDate(currentDate.getDate() + 1)

  while (currentDate <= to) {
    dateList.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dateList
}
