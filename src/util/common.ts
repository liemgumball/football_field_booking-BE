export async function wait(second: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), second * 1000)
  })
}

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
