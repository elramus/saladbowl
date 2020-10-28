import { IUser, User } from '../users/users.model'

export const userFactory = async (params?: Partial<IUser>) => {
  const user = new User({
    // Create unique name
    name: params?.name ?? `Player-${Date.now()}`,
    ipAddress: params?.ipAddress ?? null,
    socketId: params?.socketId ?? null,
  })
  await user.save()
  return user
}
