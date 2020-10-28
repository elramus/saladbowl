import { Response } from 'supertest'

export const extractToken = (response: Response): string | null => {
  const results: { [key: string]: string } = {}

  const cookies = response
    .header['set-cookie'][0]
    .split(';')

  cookies.forEach((cookie: string) => {
    const [key, value] = cookie.split('=')
    results[key] = value
  })

  return results.token ?? null
}
