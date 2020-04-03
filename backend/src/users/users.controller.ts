import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from './users.model'

const usersController = {
  async getUser(req: Request, res: Response) {
    const { userId } = req
    if (!userId) return res.send({ user: null })

    try {
      const user = await User.findById(userId)
      if (!user) return res.send({ user: null })
      return res.send({ user })
    } catch (e) {
      return res.status(400).send('Invalid user ID')
    }
  },

  async getOrCreateUser(req: Request, res: Response) {
    const { name } = req.body

    try {
      let user = await User.findOne({ name })

      // If there's no user with that name, we'll make a new one.
      if (!user) {
        user = new User({ name })
        await user.save()
      }

      // Create the JWT token and sign the user in.
      if (process.env.APP_SECRET) {
        const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET)
        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24, // 1 day cookie
        })
      }
      return res.send({ user })
    } catch (e) {
      throw new Error(e.message)
    }
  },
}

export default usersController
