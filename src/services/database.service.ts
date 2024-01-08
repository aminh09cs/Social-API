import { MongoClient, Db, Collection } from 'mongodb'
import Follower from '~/models/schemas/follower.schema'
import RefreshToken from '~/models/schemas/refresh-token.schema'
import User from '~/models/schemas/user.schema'
import '~/utils/dotenv'

const url = `mongodb+srv://${process.env.DB_DATABASE_USERNAME}:${process.env.DB_DATABASE_PASSWORD}@xbackend.wrlhply.mongodb.net/?retryWrites=true&w=majority`
class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(url)
    this.db = this.client.db(process.env.DB_NAME || 'Social-Backend')
  }
  async connectDatabase() {
    try {
      // Send a ping to confirm a successful connection
      await this.client.connect()
      console.log('Successfully connected to Atlas')
    } catch (error: unknown) {
      throw new Error('Failed to connect to MongoDB: ' + error)
    }
  }
  get users(): Collection<User> {
    return this.db.collection(process.env.DB_COLLECTION_USERS as string)
  }
  get refresh_tokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_COLLECTION_REFRESH_TOKENS as string)
  }
  get follers(): Collection<Follower> {
    return this.db.collection(process.env.DB_COLLECTION_FOLLOWER as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
