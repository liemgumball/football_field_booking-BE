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
