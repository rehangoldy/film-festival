class ResponseUtil {
  static success(res, data = null, message = 'Success', status = 200) {
    return res.status(status).json({
      status: 'success',
      message,
      data
    });
  }

  static error(res, message = 'Internal Server Error', status = 500, errors = null) {
    return res.status(status).json({
      status: 'error',
      message,
      errors
    });
  }

  static validationError(res, errors) {
    return this.error(res, 'Validation Error', 422, errors);
  }

  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = 'Forbidden') {
    return this.error(res, message, 403);
  }

  static notFound(res, message = 'Not Found') {
    return this.error(res, message, 404);
  }

  static badRequest(res, message = 'Bad Request') {
    return this.error(res, message, 400);
  }
}

module.exports = ResponseUtil;
