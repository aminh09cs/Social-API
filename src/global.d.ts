import { Request } from 'express'
import User from './models/schemas/User.schema'
import RefreshToken from './models/schemas/RefreshToken.schema'

import { Request } from 'express'

declare module 'express-serve-static-core' {
  export interface Request {
    user?: User
  }
}
