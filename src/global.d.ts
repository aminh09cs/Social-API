import { Request } from 'express'
import User from './models/schemas/user.schema'
import RefreshToken from './models/schemas/refresh-token.schema'
import { TokenType, UserVerifyStatusType } from './utils/constant'

interface DecodedTokenType {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatusType
  iat: number
  exp: number
}
declare module 'express-serve-static-core' {
  export interface Request {
    user?: User
    refresh_token?: RefreshToken
    decoded_authorization?: typeof DecodedTokenType
    decoded_email_verify_token?: typeof DecodedTokenType
    decoded_forgot_password_token?: typeof DecodedTokenType
  }
}
