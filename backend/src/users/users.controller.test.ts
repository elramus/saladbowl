import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { User } from './users.model'
import { dbConnectTest } from '../test-utils/dbConnectTest'
import usersController from './users.controller'
import { mockResponse } from '../test-utils/mockResponse'
import { emptyMongoose } from '../test-utils/emptyMongoose'

describe('getUser', () => {
  beforeAll(async () => {
    dbConnectTest()
  })
  afterEach(async () => {
    await emptyMongoose()
  })
  afterAll(async done => {
    await mongoose.connection.close()
    done()
  })

  it('should 400 with invalid user id', async () => {
    const req = { userId: 'foo' }
    const response = mockResponse()
    await usersController.getUser(req as Request, response as Response)
    expect(response.status).toHaveBeenCalledWith(400)
  })

  it('should return a valid user', async () => {
    const user = new User({ name: 'test test' })
    await user.save()
    const req = { userId: user._id.toString() }
    const response = mockResponse()
    await usersController.getUser(req as Request, response as Response)
    expect(response.send).toHaveBeenCalledWith(expect.objectContaining({
      user: expect.objectContaining({
        name: 'test test',
      }),
    }))
  })

  it('should return null user if not found', async () => {
    // Make a user so we can get a valid ID.
    const user = new User({ name: 'test test' })
    await user.save()
    // Now delete it so it won't be found when we look later.
    await User.findByIdAndDelete(user._id)
    const req = { userId: user._id.toString() }
    const response = mockResponse()
    await usersController.getUser(req as Request, response as Response)
    expect(response.send).toHaveBeenCalledWith({ user: null })
  })
})

describe('getOrCreateUser', () => {
  beforeAll(async () => {
    dbConnectTest()
    process.env.APP_SECRET = 'secret'
  })
  afterEach(async () => {
    await User.deleteMany({}).exec()
  })
  afterAll(async done => {
    await mongoose.connection.close()
    done()
  })

  it('should 400 if no name param', async () => {
    const req = { body: {} }
    const res = mockResponse()
    await usersController.getOrCreateUser(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.cookie).not.toHaveBeenCalled()
  })

  it('should create a new user if it does not exist and log them in', async () => {
    const req = {
      body: {
        name: 'New User',
      },
    }
    const res = mockResponse()
    await usersController.getOrCreateUser(req as Request, res as Response)
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
      user: expect.objectContaining({
        _id: expect.anything(),
        name: 'New User',
      }),
    }))
    expect(res.cookie).toHaveBeenCalledWith('token', expect.anything(), expect.anything())
  })

  it('should return existing user and log them in', async () => {
    const user = new User({ name: 'Existing User' })
    await user.save()
    const req = {
      body: {
        name: 'Existing User',
      },
    }
    const res = mockResponse()
    await usersController.getOrCreateUser(req as Request, res as Response)
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
      user: expect.objectContaining({
        _id: user._id,
        name: 'Existing User',
      }),
    }))
    expect(res.cookie).toHaveBeenCalledWith('token', expect.anything(), expect.anything())
  })
})
