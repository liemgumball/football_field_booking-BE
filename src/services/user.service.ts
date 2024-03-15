// **** Variables **** //

import { UserModel, TUser } from '@src/models/user.model'

export const USER_NOT_FOUND_ERR = 'User not found'

/**
 * Get all users
 */
function getAll() {
  return UserModel.find({}).exec()
}

function addOne(user: TUser) {
  return new UserModel(user).save()
}

function _delete(id: string) {
  return UserModel.deleteOne({ _id: id })
}

export default {
  getAll,
  addOne,
  delete: _delete,
}
