

export enum ValidationMessages {
  FIELD_REQUIRED = "This field is required.",
  MAX_LENGTH = "The email should have at most 50 characters",
  EMAIL_VALID_ADDRESS = "Email address must be a valid address",
}

export const ApiUrl = {
  STORE_SUPER_ADMIN_ADD: "/store-super-admin/self",
  GET_TIME_ZONE: "/timezone/get-all?is_active=true",
  SEND_EMAIL_OTP: "/store-super-admin/verify",
  EMAIL_VERIFY: "/store-super-admin/verify-email",
  GET_CURRENCY: "/currency/get",
  STORE_ADD: "/store/self/"
}
