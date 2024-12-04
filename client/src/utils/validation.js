export const validateMovieData = (data) => {
  const errors = {}

  if (!data.title?.trim()) {
    errors.title = 'Title is required'
  } else if (data.title.length > 100) {
    errors.title = 'Title must be less than 100 characters'
  }

  if (!data.description?.trim()) {
    errors.description = 'Description is required'
  } else if (data.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters'
  }

  if (!data.genres?.length) {
    errors.genres = 'At least one genre must be selected'
  } else if (data.genres.length > 3) {
    errors.genres = 'Maximum 3 genres allowed'
  }

  if (!data.video_file && !data.video_url) {
    errors.video = 'Video file or URL is required'
  }

  if (!data.thumbnail_file && !data.thumbnail_url) {
    errors.thumbnail = 'Thumbnail is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateFileType = (file, allowedTypes) => {
  if (!file) return false
  return allowedTypes.includes(file.type)
}

export const validateFileSize = (file, maxSizeMB) => {
  if (!file) return false
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg'
]

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
]

export const MAX_VIDEO_SIZE_MB = 2048 // 2GB (2048MB)
export const MAX_IMAGE_SIZE_MB = 50 // 50MB
