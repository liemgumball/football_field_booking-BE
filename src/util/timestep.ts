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
