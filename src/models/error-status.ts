import { HTTP_STATUS, MESSAGES } from '~/utils/constant'

type ErrorStatusType = Record<
  string,
  {
    [key: string]: any
  }
>
export class ErrorStatus {
  message: string
  status: number

  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

export class UnprocessableEntityErrorStatus extends ErrorStatus {
  errors: ErrorStatusType
  constructor({ errors }: { errors: any; message?: string; status?: number }) {
    super({ message: MESSAGES.UNPROCESSABLE_ENTITY, status: HTTP_STATUS.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
