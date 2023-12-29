import { ObjectId } from 'mongodb'
import { TokenType, UserVerifyStatusType } from 'src/utils/constant'
import { signToken } from 'src/utils/jwt'
import { RegisterRequestBody } from '~/models/requests/user.request'
import databaseService from './database.service'
import User from '~/models/schemas/user.schema'
import { hashPassword } from '~/utils/crypto'
import RefreshToken from '~/models/schemas/refresh-token.schema'

class UserService {
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatusType }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        verify
      },
      privateKey: process.env.JWT_ACCESS_TOKEN_KEY as string,
      options: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN }
    })
  }
  private signRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatusType }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify
      },
      privateKey: process.env.JWT_REFRESH_TOKEN_KEY as string,
      options: { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN }
    })
  }

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatusType }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken,
        verify
      },
      privateKey: process.env.JWT_EMAIL_VERIFY_TOKEN_KEY as string,
      options: { expiresIn: process.env.JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN }
    })
  }

  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatusType }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ForgotPasswordToken,
        verify
      },
      privateKey: process.env.JWT_FORGOT_PASSWORD_TOKEN_KEY as string,
      options: { expiresIn: process.env.JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN }
    })
  }

  async register(payload: RegisterRequestBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatusType.Unverified
    })
    databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        username: `user_${user_id.toString()}`,
        email_verify_token,
        password: hashPassword(payload.password),
        date_of_birth: new Date(payload.date_of_birth)
      })
    )
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken({ user_id: user_id.toString(), verify: UserVerifyStatusType.Unverified }),
      this.signRefreshToken({ user_id: user_id.toString(), verify: UserVerifyStatusType.Unverified })
    ])
    return { access_token, refresh_token }
  }
  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatusType }) {
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken({ user_id: user_id.toString(), verify: verify }),
      this.signRefreshToken({ user_id: user_id.toString(), verify: verify })
    ])
    await databaseService.refresh_tokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )
    return { access_token, refresh_token }
  }

  async logout({ token }: { token: string }) {
    await databaseService.refresh_tokens.deleteOne({ token })
  }

  async isEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
  async verifyEmail({ user_id }: { user_id: string }) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token: '',
          verify: UserVerifyStatusType.Verified
        },
        $currentDate: {
          update: true
        }
      }
    )
  }

  async resendEmail({ user_id }: { user_id: string }) {
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id,
      verify: UserVerifyStatusType.Unverified
    })
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token,
          verify: UserVerifyStatusType.Unverified
        },
        $currentDate: {
          update: true
        }
      }
    )
  }
  async forgotPassword(user: User) {
    const { _id, verify } = user
    const forgot_password_token = await this.signForgotPasswordToken({
      user_id: _id?.toString() as string,
      verify: verify
    })
    await databaseService.users.updateOne(
      { _id: _id },
      {
        $set: {
          forgot_password_token
        },
        $currentDate: {
          update: true
        }
      }
    )
  }
}

const userService = new UserService()
export default userService
