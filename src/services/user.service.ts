import { UserModel, TUser } from '@src/models/user.model'

export const USER_NOT_FOUND_ERR = 'User not found'

/**
 * Get all users
 */
function getAll() {
  return UserModel.find({}, { name: 1, email: 1 }).exec()
}

function getById(id: string) {
  return UserModel.findById(id, { password: 0 })
}

function addOne(user: TUser) {
  return new UserModel(user).save()
}

function _delete(id: string) {
  return UserModel.findByIdAndDelete(id)
}

function update(id: string, user: TUser) {
  return UserModel.findByIdAndUpdate(id, user)
}

export default {
  getAll,
  getById,
  addOne,
  delete: _delete,
  update,
}
