import { Schema, model, Document, Model } from 'mongoose'
import { compareHash, hashData } from '@src/util/hash'
import { PHONE_NUMBER_REGEX } from '@src/constants/Regex'
import { string } from 'zod'
import { TUser, UserRole } from '@src/types'
import { signJWT } from '@src/util/jwt'
import EnvVars from '@src/constants/EnvVars'

type UserDocument = TUser &
  Document & {
    createdAt: Date
    updatedAt: Date
    comparePassword: (password: string) => Promise<boolean>
    generateAuthToken: () => string
  }

type TUserModel = Model<UserDocument> & {
  isThisEmailInUse: (email: string) => Promise<boolean>
  isThisPhoneInUse: (phoneNumber: string) => Promise<boolean>
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
      trim: true,
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
      trim: true,
    },
    name: { type: String, trim: true },
    phoneNumber: {
      type: String,
      required: true,
      validate: PHONE_NUMBER_REGEX,
      trim: true,
      unique: true,
    },
    avatar: String,
    google_access_token: String,
    role: {
      type: String,
      enum: UserRole,
      default: UserRole.CUSTOMER,
    },
    verified: { type: Boolean, default: false },
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

  // TODO generate refresh token
  return token
}

UserSchema.statics.isThisEmailInUse = async function (email: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const user = await this.findOne({ email: email })
  if (user) return true

  return false
}

UserSchema.statics.isThisPhoneInUse = async function (phoneNumber: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const user = await this.findOne({ phoneNumber: phoneNumber })
  if (user) return true

  return false
}

export async function createSuperUser() {
  const existingSuperUser = await UserModel.findOne({
    role: UserRole.SUPER_USER,
  })

  if (!existingSuperUser) {
    const superuser = new UserModel({
      email: EnvVars.SuperUser.email,
      password: EnvVars.SuperUser.password,
      name: 'Super Idol',
      phoneNumber: EnvVars.SuperUser.phoneNumber,
      role: UserRole.SUPER_USER,
    })
    await superuser.save()
  }
}

// Create the User model using the schema
const UserModel = model<UserDocument, TUserModel>('User', UserSchema)

export default UserModel
