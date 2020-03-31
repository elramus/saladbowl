import express from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'

const routes = express.Router()

routes.get('/login', async (req, res) => {
  const { userId } = req
  if (userId) {
    const user = await User.findById(userId)
    if (user) {
      return res.json({ user })
    }
    return res.send('No user found with token')
  }
  return res.send('No token in request')
})

routes.post('/login', async (req, res) => {
  // Get the name from the request
  const { name } = req.body

  // Is there a user with this name?
  let user = await User.findOne({ name })

  // If there's no user with that name, let's make a new one.
  if (!user) {
    user = new User({
      name,
    })
    try {
      await user.save()
    } catch (e) {
      return res.status(500).send(e)
    }
  }

  // Create the JWT token and sign the user in.
  if (process.env.APP_SECRET) {
    const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET)
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day cookie
    })
    return res.send(user)
  }
  return res.status(500).send()
})

export default routes
