import { Schema, model } from 'mongoose'
import { compareHash, hashData } from '@src/util/hash'
import { PHONE_NUMBER_REGEX } from '@src/constants/Regex'
import { string } from 'zod'
import { TUser, UserRole } from '@src/types'
import { signJWT } from '@src/util/jwt'
import EnvVars from '@src/constants/EnvVars'

type UserDocument = TUser & {
  createdAt: Date
  updatedAt: Date
  comparePassword: (password: string) => Promise<boolean>
  generateAuthToken: () => string
}

// Define the Mongoose schema for the user document
const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      immutable: true,
      validate: {
        // zod email schema validation
        validator: (email: string) =>
          string()
            .email()
            .transform((val) => val.toLowerCase())
            .safeParse(email).success,
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Minimum password length is 6 characters'],
    },
    name: String,
    phone_number: {
      type: String,
      required: true,
      unique: true,
      validate: PHONE_NUMBER_REGEX,
    },
    avatar: String,
    google_access_token: String,
    role: {
      type: String,
      enum: UserRole,
      default: UserRole.CUSTOMER,
    },
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return compareHash(password, this.password)
}

/**
 * Generates an authentication token for the user.
 * @returns {string} - The generated authentication token.
 */
UserSchema.methods.generateAuthToken = function (): string {
  const token = signJWT(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    { _id: this._id, role: this.role },
  )
  return token
}

// Create the User model using the schema
export const UserModel = model<UserDocument>('User', UserSchema)

export async function createSuperUser() {
  const existingSuperUser = await UserModel.findOne({
    role: UserRole.SUPER_USER,
  })

  if (!existingSuperUser) {
    const superuser = new UserModel({
      email: EnvVars.SuperUser.email,
      password: EnvVars.SuperUser.password,
      name: 'Super Idol',
      phone_number: EnvVars.SuperUser.phoneNumber,
      role: UserRole.SUPER_USER,
    })
    await superuser.save()
  }
}
