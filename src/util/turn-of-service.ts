import { TTurnOfService, TurnOfServiceStatus } from '@src/types'
import { getIndexOfTimeStep, getTimeStepFromIndex } from './timestep'

/**
 * Updates the turns of services data by merging the old and new data.
 * @param {TTurnOfService[]} old - The data from the database.
 * @param {TTurnOfService[]} new_ - The new data from the request.
 * @returns {TTurnOfService[]} The merged data.
 */
export function updateTurnOfServices(
  old: TTurnOfService[],
  new_: TTurnOfService[],
): TTurnOfService[] {
  return old.map((ele) => {
    const foundIndex = new_.findIndex((e) => e.at === ele.at)

    if (foundIndex !== -1) {
      return {
        at: ele.at,
        price: new_[foundIndex].price || ele.price,
        status: new_[foundIndex].status || ele.status,
        bookingId: new_[foundIndex].bookingId || ele.bookingId,
      }
    } else {
      return ele
    }
  })
}

/**
 * Generates a list of turns of services between two time steps with a specified price.
 * @param {string} from - The starting time step.
 * @param {string} to - The ending time step.
 * @param {number} price - The price for each turn of service.
 * @returns {Partial<TTurnOfService>[] | null} A list of turns of services or null if the ending time step is before or equal to the starting time step.
 */
export function getListTurnOfServices(
  from: string,
  to: string,
  price: number,
): Partial<TTurnOfService>[] | null {
  let start = getIndexOfTimeStep(from)
  const end = getIndexOfTimeStep(to)

  if (end <= start) return null
  const result = []

  while (start <= end) {
    result.push({
      at: getTimeStepFromIndex(start),
      price: price,
    })

    start = start + 1
  }

  return result
}

/**
 * Checks the status of turns of services within a specified range.
 * @param {TTurnOfService[]} list - The list of turns of services.
 * @param {string} from - The starting time step.
 * @param {string} to - The ending time step.
 * @param {TurnOfServiceStatus} status - The status to check for.
 * @returns {boolean} True if all turns of services within the range have the specified status, otherwise false.
 */
export function checkTurnOfServiceStatus(
  list: TTurnOfService[],
  from: string,
  to: string,
  status: TurnOfServiceStatus,
): boolean {
  const start = list.findIndex((val) => val.at === from)
  const end = list.findIndex((val) => val.at === to)

  return list.slice(start, end).every((val) => val.status === status)
}
