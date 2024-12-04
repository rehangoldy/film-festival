class ValidatorUtil {
  static validateMovie(data) {
    const errors = {};

    if (!data.title) {
      errors.title = 'Title is required';
    }

    if (!data.duration || data.duration < 0) {
      errors.duration = 'Valid duration is required';
    }

    if (data.artists && !Array.isArray(data.artists)) {
      errors.artists = 'Artists must be an array';
    }

    if (data.genres && !Array.isArray(data.genres)) {
      errors.genres = 'Genres must be an array';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validateUser(data, isUpdate = false) {
    const errors = {};

    if (!isUpdate) {
      if (!data.email) {
        errors.email = 'Email is required';
      } else if (!this.isValidEmail(data.email)) {
        errors.email = 'Invalid email format';
      }

      if (!data.password) {
        errors.password = 'Password is required';
      } else if (data.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
    }

    if (!data.name) {
      errors.name = 'Name is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = ValidatorUtil;
