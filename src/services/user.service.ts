import UserModel from '@src/models/user.model'
import { TUser, UserRole } from '@src/types'
import z from 'zod'

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
 * Get user by id
 * @param email of the user
 */
export function getByEmail(email: string) {
  return UserModel.findOne({ email }, { password: 0 })
}

/**
 * Create a new user in database
 * @param user data
 */
export async function create(user: Omit<TUser, '_id'>) {
  const emailInUse = await UserModel.isThisEmailInUse(user.email)
  const phoneInUse = user.phoneNumber
    ? await UserModel.isThisPhoneInUse(user.phoneNumber)
    : false

  if (emailInUse || phoneInUse) {
    const errors: z.ZodIssue[] = []

    if (emailInUse)
      errors.push({
        code: 'custom',
        message: 'This email already in use',
        path: ['body', 'email'],
      })

    if (phoneInUse)
      errors.push({
        code: 'custom',
        message: 'This phone number already in use',
        path: ['body', 'phoneNumber'],
      })

    throw new z.ZodError(errors)
  }

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
export function update(id: string, user: Partial<TUser>) {
  return UserModel.findByIdAndUpdate(id, user, {
    projection: { password: 0 },
  })
}

export async function change_password(id: string, new_password: string) {
  const user = await UserModel.findById(id)

  if (!user) {
    throw new Error('User not found')
  }

  user.password = new_password

  return await user.save()
}

/**
 * Validate the user authentication
 * @param email of the user
 * @param _password to validate the user
 * @returns user's data if valid
 */
export async function validateLogin(email: string, _password?: string) {
  const user = await UserModel.findOne({ email }).exec()

  if (!user || !_password) return null

  const isValid = user.comparePassword(_password)

  if (!isValid) return null

  if (user.role === UserRole.CUSTOMER && !user.verified) return 'not_verified'

  const token = user.generateAuthToken()

  // Omit password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user.toObject()

  return { ...rest, token }
}

export function verify(id: string) {
  return UserModel.findByIdAndUpdate(id, { verified: true })
}

/**
 * Get user by googleId
 * @param id googleId
 */
export async function loginByGoogleId(id: string) {
  const user = await UserModel.findOne({ googleId: id }, { password: 0 }).exec()

  if (!user) return false

  const token = user.generateAuthToken()

  return { ...user.toObject(), token }
}
