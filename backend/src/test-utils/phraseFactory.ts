import faker from 'faker'
import { IPhrase, Phrase } from '../phrases/phrases.model'
import { userFactory } from './userFactory'

export const phraseFactory = async (
  params?: Partial<IPhrase>,
) => {
  let authorId = null
  if (!params || !params.authorId) {
    const author = await userFactory()
    authorId = author._id
  } else {
    authorId = params.authorId
  }
  const phrase = new Phrase({
    text: faker.lorem.words(4),
    authorId,
  })
  await phrase.save()
  return phrase
}
