import { Schema, model, Document } from 'mongoose'
import { sign } from 'jsonwebtoken'
import EnvVars from '@src/constants/EnvVars'
import { compareHash, hashData } from '@src/util/hash'
import { PHONE_NUMBER_REGEX } from '@src/constants/Regex'

/**
 * Represents the structure of a user document in the database.
 */
type TUser = {
  _id?: Schema.Types.ObjectId
  email: string
  password: string
  name?: string
  phone_number?: string
  avatar?: string
  access_token?: string
  google_access_token?: string
  createdAt: Date
  updatedAt: Date
} & Document

// Define the Mongoose schema for the user document
const UserSchema = new Schema<TUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    phone_number: {
      type: String,
      required: true,
      unique: true,
      match: PHONE_NUMBER_REGEX,
    },
    avatar: String,
    access_token: String,
    google_access_token: String,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  },
)

/**
 * Hash the password for the user document
 */
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  const hash = hashData(this.password)

  this.password = hash

  return next()
})

/**
 * compares the password against the current hashed password
 * @param password to compare
 * @returns if matches
 */
UserSchema.methods.comparePassword = function (password: string) {
  return compareHash(password, this.password as string)
}

/**
 * Generates an authentication token for the user.
 * @returns {string} - The generated authentication token.
 */
UserSchema.methods.generateAuthToken = function (): string {
  const token = sign({ _id: this._id }, EnvVars.Jwt.Secret, {
    expiresIn: '7d',
  })
  return token
}

// Create the User model using the schema
const UserModel = model<TUser>('User', UserSchema)

export { UserModel, TUser }
