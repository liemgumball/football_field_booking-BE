/**
 * Asynchronously waits for the specified number of seconds.
 * @param {number} seconds - The number of seconds to wait.
 * @returns {Promise<void>} A Promise that resolves after the specified number of seconds.
 */
export async function wait(second: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), second * 1000)
  })
}

/**
 * Sorts the keys of an object and returns a new object with the sorted keys.
 * @param {Record<string, unknown>} obj - The object whose keys are to be sorted.
 * @returns {Record<string, string>} A new object with the keys sorted alphabetically.
 */
export function sortObject(
  obj: Record<string, unknown>,
): Record<string, string> {
  const sorted: Record<string, string> = {}
  const str: string[] = []

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key))
    }
  }

  str.sort()

  for (let i = 0; i < str.length; i++) {
    sorted[str[i]] = encodeURIComponent(
      obj[str[i]] as string | number | boolean,
    ).replace(/%20/g, '+')
  }

  return sorted
}

export function generateRandomPassword(length: number) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-='
  const allChars = uppercase + lowercase + numbers + specialChars

  let password = ''

  // Ensure the password includes at least one character from each set
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += specialChars[Math.floor(Math.random() * specialChars.length)]

  // Generate the remaining characters randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Shuffle the password to ensure random distribution
  password = password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')

  return password
}
