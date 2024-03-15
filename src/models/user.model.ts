import { Schema, model, Document } from 'mongoose'
import { sign } from 'jsonwebtoken'
import EnvVars from '@src/constants/EnvVars'
import { compareHash, hashData } from '@src/util/hash'

/**
 * Represents the structure of a user document in the database.
 */
type TUser = {
  email: string
  password: string
  name?: string
  phone_number?: number
  avatar?: string
  access_token?: string
  google_access_token?: string
  createdAt: Date
  updatedAt: Date
} & Document

// Define the Mongoose schema for the user document
const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    phone_number: { type: Number, required: true, unique: true },
    avatar: String,
    access_token: String,
    google_access_token: String,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  },
)

// Middleware to run before saving a user document
UserSchema.pre('save', function (next) {
  const user = this as TUser
  if (!user.isModified('password')) {
    return next()
  }

  const hash = hashData(user.password)

  user.password = hash

  return next()
})

UserSchema.methods.comparePassword = function (password: string) {
  const user = this as TUser
  return compareHash(password, user.password)
}

/**
 * Generates an authentication token for the user.
 * @returns {string} - The generated authentication token.
 */
UserSchema.methods.generateAuthToken = function (): string {
  const user = this as TUser
  const token = sign({ _id: user._id }, EnvVars.Jwt.Secret, {
    expiresIn: '7d',
  })
  return token
}

// Create the User model using the schema
const UserModel = model<TUser>('User', UserSchema)

/**
 * Checks if the provided argument is of type TUser.
 * @param {unknown} arg - The argument to check.
 * @returns {boolean} - True if the argument is of type TUser, false otherwise.
 */
function isUser(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'email' in arg &&
    'password' in arg &&
    'phone_number' in arg
  )
}

export { UserModel, TUser, isUser }
