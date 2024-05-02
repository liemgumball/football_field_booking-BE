import { TimeStep } from '@src/types'

/**
 * Get the index of a time step in a day.
 * @param {string} str - The time step formatted as `HH:MM`.
 * @returns {number} The index of the time step in the day.
 */
export function getIndexOfTimeStep(str: string): number {
  const list = str.split(':')
  const hours = parseInt(list[0])
  const minutes = parseInt(list[1])

  return hours * 2 + minutes / 30
}

/**
 * Get the time step from its index in a day.
 * @param {number} index - The index of the time step in the day.
 * @returns {string} The time step in the day formatted as `HH:MM`.
 */
export function getTimeStepFromIndex(index: number): string {
  const hours = Math.floor(index / 2)
  const minutes = (index % 2) * 30

  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}`
}

/**
 * Get the length between two time steps in a day.
 * @param {string} start - The starting time step formatted as `HH:MM`.
 * @param {string} end - The ending time step formatted as `HH:MM`.
 * @returns {number} The length between the two time steps.
 */
export function getTimeStepLength(start: string, end: string): number {
  const startIndex = getIndexOfTimeStep(start)
  const endIndex = getIndexOfTimeStep(end)

  if (endIndex <= startIndex) return -1

  return endIndex - startIndex
}

/**
 * Get the date from a given time step and date.
 * @param {Date} date - The date to use as a base.
 * @param {TimeStep} time - The time step to extract the time from.
 * @returns {Date} A new date with the time set to the specified time step.
 */
export function getDateFromTimeStep(date: Date, time: TimeStep): Date {
  const list = time.split(':')
  const hour = parseInt(list[0])
  const minute = parseInt(list[1])

  const newDate = new Date(date)
  newDate.setUTCHours(hour)
  newDate.setUTCMinutes(minute)

  return newDate
}
