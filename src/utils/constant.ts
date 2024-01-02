export const MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  NAME_IS_REQUIRED: 'Name is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  EMAIL_IS_VERIFIED_BEFORE: 'Email is verified before',
  PASSWORD_LENGTH: 'Password should be at least 8 chars',
  PASSWORD_IS_REQUIRED: 'Password is required',
  CONFIRM_PASSWORD_LENGTH: 'Confirm password should be at least 8 chars',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  PASSWORD_CONFIRMPASSWORD_NOT_SAME: 'Confirm password must be same with password',
  DATE_OF_BIRTH_IS_REQUIRED: 'Date of birth is required',
  UNPROCESSABLE_ENTITY: 'Unprocessable Entity',
  AUTHENTICATION_FAILED: 'Authentication failed',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_OR_USER_IS_NOT_EXIST: 'Refresh token is used or not exist',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  FORGOT_PASSWORD_IS_INVALID: 'Forgot password is invalid'
}
export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  UNPROCESSABLE_ENTITY: 422,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  REQUEST_TIMEOUT: 408,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
}

export enum UserVerifyStatusType {
  Unverified,
  Verified,
  Banned
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}
