export class ApiResponse {
  static success(message: string, data: any = null, statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }

  static error(message: string, errors: any = null, statusCode = 500) {
    return {
      success: false,
      statusCode,
      message,
      errors,
    };
  }
}
