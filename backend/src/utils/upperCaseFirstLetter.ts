export const upperCaseFirstLetter = (value: string) => {
  const firstL = value.slice(0, 1).toUpperCase()
  const rest = value.slice(1)
  return `${firstL}${rest}`
}
