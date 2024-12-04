import { useToast } from 'vue-toastification'

const toast = useToast()

export const handleError = (error) => {
  console.error('Error:', error)

  if (error.response?.data?.errors) {
    // Handle validation errors
    const errors = error.response.data.errors
    Object.values(errors).forEach(error => {
      toast.error(error[0])
    })
    return errors
  }

  if (error.response?.data?.message) {
    // Handle server error messages
    toast.error(error.response.data.message)
    return error.response.data.message
  }

  if (error.message) {
    // Handle general error messages
    toast.error(error.message)
    return error.message
  }

  // Handle unknown errors
  const defaultMessage = 'An unexpected error occurred. Please try again.'
  toast.error(defaultMessage)
  return defaultMessage
}

export const handleSuccess = (message) => {
  toast.success(message)
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500
}

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_FAILED: 'Please check your input and try again.',
  DEFAULT: 'An unexpected error occurred. Please try again.'
}
