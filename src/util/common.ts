export async function wait(second: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), second * 1000)
  })
}
