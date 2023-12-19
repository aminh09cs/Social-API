import { checkSchema } from 'express-validator'
import { validate } from '~/utils/support'
import { HTTP_STATUS, MESSAGES } from '~/utils/constant'
import { ErrorStatus } from '~/models/error-status'

export const registerValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: true,
        errorMessage: MESSAGES.EMAIL_IS_INVALID,
        custom: {
          options: (value) => {
            if (value === 'blue@gmail.com') {
              throw new ErrorStatus({ message: MESSAGES.EMAIL_ALREADY_EXISTS, status: HTTP_STATUS.CONFLICT })
            }
          }
        }
      },
      password: {
        isLength: {
          options: { min: 8 },
          errorMessage: 'Password should be at least 8 chars'
        }
      }
    },
    ['body']
  )
)
