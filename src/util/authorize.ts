import { UserRole } from '@src/types'
import { IUserSession } from '@src/types/express/misc'
import { Types } from 'mongoose'

/**
 * Check if the user requested is admin of the football field
 * Handle request response as well
 */
export function checkAdmin(adminId?: Types.ObjectId, user?: IUserSession) {
  // eslint-disable-next-line no-unsafe-optional-chaining

  if (user?.role === UserRole.CUSTOMER) return false

  if (user?.role === UserRole.ADMIN && !adminId?.equals(user?._id)) return false

  return true
}

/**
 * Check if the user requested is superuser or not
 */
export function checkSuperUser(user?: IUserSession) {
  // eslint-disable-next-line no-unsafe-optional-chaining

  if (user?.role === UserRole.SUPER_USER) return true

  return false
}
