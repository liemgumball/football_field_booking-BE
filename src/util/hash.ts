import { genSaltSync, hashSync, compareSync } from 'bcrypt'

/**
 * Generate a salt synchronously with a given cost factor.
 */
const salt = genSaltSync(10)

/**
 * Hashes the provided data synchronously.
 * @param {string} data - The data to be hashed.
 * @returns {string} - The hashed data.
 */
const hashData = (data: string): string => hashSync(data, salt)

/**
 * Compares the provided data with a hashed data string synchronously.
 * @param {string} data - The data to be compared.
 * @param {string} hashedData - The hashed data to compare against.
 * @returns {boolean} - True if the matches the hashed data, false otherwise.
 */
const compareHash = (data: string, hashedData: string): boolean =>
  compareSync(data, hashedData)

export { hashData, compareHash }
