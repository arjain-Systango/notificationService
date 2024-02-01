export class Constants {
  static Http = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    CONFLICT: 409,
    UNPROCESSABLE: 422,
  };
  static SuccessMessage = {
    EMAIL_REQUEST_RECEIVED: 'Email request received',
    TOKEN_INSERTED_SUCCESSFULLY: 'FCM token inserted successfully',
    TOKEN_DELETED_SUCCESSFULLY: 'FCM token deleted successfully',
    PUSH_N_REQUEST_RECEIVED: 'Push notification request received',
    PUSH_N_STATUS_UPDATED_SUCCESSFULLY:
      'Push notification status updated successfully',
  };

  static ErrorMessage = {
    INVALID_TOKEN: 'Invalid token',
    INVALID_USER: 'Invalid user',
    TEMPLATE_NOT_FOUND: 'Template not found',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    FAILED_TO_FETCH_EMAILS: 'Failed to fetch emails',
    FCM_TOKEN_NOT_FOUND: 'FCM token not found',
    FAILED_TO_INSERT_TOKEN: 'Failed to insert FCM token',
    FAILED_TO_DELETE_TOKEN: 'Failed to delete FCM token',
    FAILED_TO_REGISTER_PUSH_N_REQUEST:
      'Failed to register send push notification request',
    FAILED_TO_FETCH_PUSH_N: 'Failed to fetch push notifications',
    FAILED_TO_UPDATE_PUSH_N_STATUS: 'Failed to update push notification status',
    DATA_NOT_FOUND_FOR_VALIDATION: 'Data not found for validation',
    INVALID_INPUT_SCHEMA: 'Invalid input schema',
    NOTIFICATION_DOES_NOT_EXIST: 'Notification does not exist',
    TOKEN_DOES_NOT_EXIST: 'FCM Token does not exist',
    AUTHORIZATION_HEADER_MISSING: 'Authorization header missing',
    UNAUTHORIZED: 'UNAUTHORIZED',
    INVALID_AUTHORIZATION_TOKEN: 'Invalid authorization token',
    MISSING_HEADERS: 'Missing header',
    INVALID_API_KEY: 'Invalid API key in header',
    INVALID_AUTHORIZATION_ROLE: 'Invalid authorization role',
  };
}
