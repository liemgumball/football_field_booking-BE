import { UserModel } from '@src/models/user.model'
import { TUser, UserRole } from '@src/types'

export const USER_NOT_FOUND_ERR = 'User not found'

/**
 * Get all users
 */
export function getAll() {
  return UserModel.find({}, { name: 1, email: 1, role: 1 })
}

/**
 * Get user by id
 * @param id of the user
 */
export function getById(id: string) {
  return UserModel.findById(id, { password: 0 })
}

/**
 * Create a new user in database
 * @param user data
 */
export function create(user: TUser) {
  return UserModel.create(user)
}

export function createAdminUser(user: TUser) {
  // Set role to admin
  user.role = UserRole.ADMIN

  return UserModel.create(user)
}
/**
 * Delete a user by id
 * @param id of user
 * @returns
 */
export function delete_(id: string) {
  return UserModel.findByIdAndDelete(id, {
    projection: { password: 0 },
  })
}

/**
 * Update the user found by id
 * @param id of user
 * @param user new data
 */
export function update(id: string, user: TUser) {
  return UserModel.findByIdAndUpdate(id, user, {
    projection: { password: 0 },
  })
}

/**
 * Validate the user authentication
 * @param email of the user
 * @param _password to validate the user
 * @returns user's data if valid
 */
export async function validateLogin(email: string, _password: string) {
  const user = await UserModel.findOne({ email }).exec()

  if (!user) return false

  const isValid = user.comparePassword(_password)

  if (!isValid) return false

  const token = user.generateAuthToken()

  // Omitting the password field
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user.toObject()

  return { ...rest, token }
}
