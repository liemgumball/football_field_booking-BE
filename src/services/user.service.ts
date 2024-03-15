import { UserModel, TUser } from '@src/models/user.model'

export const USER_NOT_FOUND_ERR = 'User not found'

/**
 * Get all users
 */
export function getAll() {
  return UserModel.find({}, { name: 1, email: 1 }).exec()
}

export function getById(id: string) {
  return UserModel.findById(id, { password: 0 })
}

export function add(user: TUser) {
  return new UserModel(user).save()
}

export function delete_(id: string) {
  return UserModel.findByIdAndDelete(id)
}

export function update(id: string, user: TUser) {
  return UserModel.findByIdAndUpdate(id, user)
}
