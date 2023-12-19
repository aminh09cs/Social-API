import { MongoClient, Db } from 'mongodb'
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
  get users() {
    return this.db.collection('users')
  }
}

const database = new DatabaseService()
export default database