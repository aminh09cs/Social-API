import databaseService from '~/services/database.service'
import userService from '~/services/user.service'
import { hashPassword } from '~/utils/crypto'
import { check, checkSchema } from 'express-validator'
import { validate } from '~/utils/support'
import { HTTP_STATUS, MESSAGES } from '~/utils/constant'
import { ErrorStatus } from '~/models/error-status'
import { verifyToken } from '~/utils/jwt'
import { ObjectId } from 'mongodb'

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value, { req }) => {
            if (!value)
              throw new ErrorStatus({ message: MESSAGES.ACCESS_TOKEN_IS_REQUIRED, status: HTTP_STATUS.UNAUTHORIZED })
            const access_token = value.split(' ')[1] // replace('Bearer ),''
            const decoded_authorization = await verifyToken({
              token: access_token,
              secretKey: process.env.JWT_ACCESS_TOKEN_KEY as string
            })
            req.decoded_authorization = decoded_authorization
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        custom: {
          options: async (value, { req }) => {
            if (!value)
              throw new ErrorStatus({ message: MESSAGES.REFRESH_TOKEN_IS_REQUIRED, status: HTTP_STATUS.UNAUTHORIZED })

            const [decoded_refresh_token, refresh_token] = await Promise.all([
              verifyToken({ token: value, secretKey: process.env.JWT_REFRESH_TOKEN_KEY as string }),
              databaseService.refresh_tokens.findOne({ token: value })
            ])
            console.log(decoded_refresh_token)
            if (!refresh_token) {
              throw new ErrorStatus({
                message: MESSAGES.REFRESH_TOKEN_OR_USER_IS_NOT_EXIST,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            req.decoded_refresh_token = decoded_refresh_token
            req.refresh_token = refresh_token
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyEmailTokenValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        custom: {
          options: async (value, { req }) => {
            if (!value)
              throw new ErrorStatus({
                message: MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            const decoded_email_verify_token = await verifyToken({
              token: value,
              secretKey: process.env.JWT_EMAIL_VERIFY_TOKEN_KEY as string
            })
            req.decoded_email_verify_token = decoded_email_verify_token
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: MESSAGES.NAME_IS_REQUIRED
        },
        isLength: { options: { min: 1, max: 250 } }
      },

      email: {
        notEmpty: {
          errorMessage: MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: MESSAGES.EMAIL_IS_INVALID
        },
        custom: {
          options: async (value) => {
            const isExist = await userService.isEmailExist(value)
            if (isExist) {
              throw new ErrorStatus({ message: MESSAGES.EMAIL_ALREADY_EXISTS, status: HTTP_STATUS.CONFLICT })
            }
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: MESSAGES.PASSWORD_IS_REQUIRED
        },
        isLength: {
          options: { min: 8, max: 250 },
          errorMessage: MESSAGES.PASSWORD_LENGTH
        }
      },
      confirm_password: {
        notEmpty: {
          errorMessage: MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        },
        isLength: {
          options: { min: 8, max: 250 },
          errorMessage: MESSAGES.CONFIRM_PASSWORD_LENGTH
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(MESSAGES.PASSWORD_CONFIRMPASSWORD_NOT_SAME)
            }
            return true
          }
        }
      },
      date_of_birth: {
        notEmpty: {
          errorMessage: MESSAGES.DATE_OF_BIRTH_IS_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          }
        }
      }
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: MESSAGES.EMAIL_IS_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
            if (!user) {
              throw new ErrorStatus({ message: MESSAGES.AUTHENTICATION_FAILED, status: HTTP_STATUS.UNAUTHORIZED })
            }
            req.user = user
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: MESSAGES.PASSWORD_IS_REQUIRED
        },
        isLength: {
          options: { min: 8, max: 250 },
          errorMessage: MESSAGES.PASSWORD_LENGTH
        }
      }
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: MESSAGES.EMAIL_IS_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value
            })
            if (!user) {
              throw new ErrorStatus({ message: MESSAGES.USER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)
export const verifyForgotPasswordValidator = validate(
  checkSchema(
    {
      forgot_password_token: {
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                message: MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            const decoded_forgot_password_token = await verifyToken({
              token: value,
              secretKey: process.env.JWT_FORGOT_PASSWORD_TOKEN_KEY as string
            })
            const { user_id } = decoded_forgot_password_token
            const user = databaseService.users.findOne({ _id: new ObjectId(user_id) })
            if (!user) {
              throw new ErrorStatus({
                message: MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      password: {
        notEmpty: {
          errorMessage: MESSAGES.PASSWORD_IS_REQUIRED
        },
        isLength: {
          options: { min: 8, max: 250 },
          errorMessage: MESSAGES.PASSWORD_LENGTH
        }
      },
      confirm_password: {
        notEmpty: {
          errorMessage: MESSAGES.PASSWORD_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(MESSAGES.PASSWORD_CONFIRMPASSWORD_NOT_SAME)
            }
          }
        }
      },
      forgot_password_token: {
        custom: {
          options: async (value, { req }) => {
            const decoded_forgot_password_token = await verifyToken({
              token: value,
              secretKey: process.env.JWT_FORGOT_PASSWORD_TOKEN_KEY as string
            })
            const { user_id } = decoded_forgot_password_token
            const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
            if (user === null) {
              throw new ErrorStatus({ message: MESSAGES.USER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
            }
            if (user.forgot_password_token !== value) {
              throw new ErrorStatus({ message: MESSAGES.FORGOT_PASSWORD_IS_INVALID, status: HTTP_STATUS.UNAUTHORIZED })
            }
            req.decoded_forgot_password_token = decoded_forgot_password_token
          }
        }
      }
    },
    ['body']
  )
)
