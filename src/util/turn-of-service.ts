import { TTurnOfService, TurnOfServiceStatus } from '@src/types'
import { getIndexOfTimeStep, getTimeStepFromIndex } from './timestep'

/**
 * Returns the merged of Turns of services
 * @param old The data in `BD`
 * @param new_ New data from request
 * @returns Merged data
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

export function getListTurnOfServices(
  from: string,
  to: string,
  price: number,
): Pick<TTurnOfService, 'at' | 'price'>[] | null {
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

export function checkTurnOfServiceStatus(
  list: TTurnOfService[],
  from: string,
  to: string,
  status: TurnOfServiceStatus,
) {
  const start = list.findIndex((val) => val.at === from)
  const end = list.findIndex((val) => val.at === to)

  return list.slice(start, end).every((val) => val.status === status)
}
