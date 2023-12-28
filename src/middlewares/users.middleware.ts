import databaseService from '~/services/database.service'
import userService from '~/services/user.service'
import { hashPassword } from '~/utils/crypto'
import { checkSchema } from 'express-validator'
import { validate } from '~/utils/support'
import { HTTP_STATUS, MESSAGES } from '~/utils/constant'
import { ErrorStatus } from '~/models/error-status'

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
  checkSchema({
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
          if (user === null) {
            throw new ErrorStatus({ message: MESSAGES.AUTHENTICATION_FAILED, status: HTTP_STATUS.UNAUTHORIZED })
          }
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
  })
)
