import mongoose from 'mongoose'
import { dbConnectTest } from '../test-utils/dbConnectTest'
import { User } from './users.model'

describe('user model', () => {
  beforeAll(async () => {
    dbConnectTest()
  })
  afterEach(async () => {
    await User.deleteMany({}).exec()
  })
  afterAll(async done => {
    await mongoose.connection.close()
    done()
  })

  it('should save the passed in params', async () => {
    const user = new User({
      name: 'New User',
      ipAddress: '111.111.111.111',
      socketId: '11111111',
    })
    await user.save()
    expect(user.name).toBe('New User')
    expect(user.ipAddress).toBe('111.111.111.111')
    expect(user.socketId).toBe('11111111')
  })

  it('should use the default params', async () => {
    const user = new User({
      name: 'New User',
    })
    await user.save()
    expect(user.name).toBe('New User')
    expect(user.ipAddress).toBeNull()
    expect(user.socketId).toBeNull()
  })
})
