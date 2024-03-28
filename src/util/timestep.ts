import { TimeStep } from '@src/types'

// Today
export function getToday(from = new Date()) {
  const today = new Date(from)
  today.setUTCHours(23, 59, 0, 0)
  return today
}

export function getNextHour(from = new Date()) {
  const nextHour = new Date(from)
  nextHour.setHours(nextHour.getHours() + 1)
  return nextHour
}

// Tomorrow
export function getTomorrow(from = new Date()) {
  const tomorrow = new Date(from)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setUTCHours(23, 59, 59, 0)
  return tomorrow
}

// NextWeek
export function getNextWeek(from = new Date()) {
  const nextWeek = new Date(from)
  nextWeek.setDate(nextWeek.getDate() + 7)
  nextWeek.setUTCHours(23, 59, 59, 0)
  return nextWeek
}

// Next Month
export function getNextMonth(from = new Date()) {
  const nextMonth = new Date(from)
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  nextMonth.setUTCHours(23, 59, 59, 0)
  return nextMonth
}

/**
 * Get index time step in day
 * @example
 * const str = '01:30'
 * return 3
 * @param str formatted `HH:MM`
 */
export function getIndexOfTimeStep(str: string) {
  const list = str.split(':')
  const hours = parseInt(list[0])
  const minutes = parseInt(list[1])

  return hours * 2 + minutes / 30
}

/**
 * Get the time step from its index in day
 * @example
 * const index = 3
 * return '01:30'
 * @param index of time step in day
 * @returns time step in day formatted `HH:MM`
 */
export function getTimeStepFromIndex(index: number): string {
  // Calculate hours and minutes based on the index
  const hours = Math.floor(index / 2)
  const minutes = (index % 2) * 30

  // Format hours and minutes as HH:MM
  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}`
}

/**
 * Get length from 2 time step in day
 * @example
 * const start = '01:30'
 * const end = '20:30
 * return
 * @param start formatted `HH:MM`
 * @param end formatted `HH:MM`
 */
export function getTimeStepLength(start: string, end: string): number {
  const startIndex = getIndexOfTimeStep(start)
  const endIndex = getIndexOfTimeStep(end)

  if (endIndex <= startIndex) return -1

  return endIndex - startIndex
}

export function getDateFromTimeStep(date: Date, time: TimeStep): Date {
  const list = time.split(':')
  const hour = parseInt(list[0])
  const minute = parseInt(list[1])

  const now = new Date(date)
  now.setHours(hour)
  now.setMinutes(minute)

  return now
}
