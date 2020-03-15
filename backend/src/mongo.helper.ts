import mongodb, { MongoClient } from 'mongodb'

export class MongoHelper {
  public static client: MongoClient

  public static connect(url: string) {
    return new Promise((resolve, reject) => {
      mongodb.MongoClient.connect(url, (err, client: MongoClient) => {
        if(err) {
          reject(err)
        } else {
          MongoHelper.client = client
          resolve(client)
        }
      })
    })
  }
}