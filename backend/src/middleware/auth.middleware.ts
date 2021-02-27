import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { token } = req.cookies
  if (token && process.env.APP_SECRET) {
    // eslint-disable-next-line
    const decoded: any = jwt.verify(token, process.env.APP_SECRET)
    if (decoded && decoded.userId) {
      req.userId = decoded.userId
    }
  }
  next()
}
