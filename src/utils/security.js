/**
 * Security Utilities
 *
 * Provides input validation and sanitization functions to prevent
 * XSS attacks, SQL injection, and other security vulnerabilities.
 */

/**
 * Sanitize string input by removing potentially dangerous characters
 * Prevents XSS attacks by stripping HTML tags and script content
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return input

  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '')

  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '')

  // Trim whitespace
  sanitized = sanitized.trim()

  return sanitized
}

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate number input
 * Prevents NaN, Infinity, and negative numbers (if positive required)
 */
export const validateNumber = (value, options = {}) => {
  const {
    min = -Infinity,
    max = Infinity,
    allowNegative = true,
    allowDecimal = true,
  } = options

  const num = Number(value)

  // Check if it's a valid number
  if (isNaN(num) || !isFinite(num)) {
    return { valid: false, error: 'Invalid number' }
  }

  // Check negative constraint
  if (!allowNegative && num < 0) {
    return { valid: false, error: 'Negative numbers not allowed' }
  }

  // Check decimal constraint
  if (!allowDecimal && num % 1 !== 0) {
    return { valid: false, error: 'Decimal numbers not allowed' }
  }

  // Check min/max range
  if (num < min) {
    return { valid: false, error: `Number must be at least ${min}` }
  }

  if (num > max) {
    return { valid: false, error: `Number must be at most ${max}` }
  }

  return { valid: true, value: num }
}

/**
 * Validate and sanitize financial amount
 * Specific validation for money amounts
 */
export const validateAmount = (amount) => {
  const validation = validateNumber(amount, {
    min: 0,
    max: 999999999.99, // ~1 billion limit
    allowNegative: false,
    allowDecimal: true,
  })

  if (!validation.valid) {
    return validation
  }

  // Round to 2 decimal places for currency
  const roundedValue = Math.round(validation.value * 100) / 100

  return { valid: true, value: roundedValue }
}

/**
 * Validate string length
 * Prevents excessively long inputs that could cause issues
 */
export const validateStringLength = (str, minLength = 0, maxLength = 1000) => {
  if (typeof str !== 'string') {
    return { valid: false, error: 'Input must be a string' }
  }

  const length = str.trim().length

  if (length < minLength) {
    return { valid: false, error: `Input must be at least ${minLength} characters` }
  }

  if (length > maxLength) {
    return { valid: false, error: `Input must be at most ${maxLength} characters` }
  }

  return { valid: true, value: str.trim() }
}

/**
 * Validate date input
 * Ensures date is valid and within reasonable range
 */
export const validateDate = (dateString) => {
  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date' }
  }

  // Check if date is reasonable (between 1900 and 100 years in the future)
  const minDate = new Date('1900-01-01')
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 100)

  if (date < minDate || date > maxDate) {
    return { valid: false, error: 'Date is out of valid range' }
  }

  return { valid: true, value: date }
}

/**
 * Sanitize object properties
 * Recursively sanitizes all string values in an object
 */
export const sanitizeObject = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  const sanitized = Array.isArray(obj) ? [] : {}

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Validate file upload
 * Ensures uploaded files are safe
 */
export const validateFile = (file, options = {}) => {
  const {
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    maxSize = 5 * 1024 * 1024, // 5MB default
  } = options

  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    }
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    }
  }

  // Check file name length
  if (file.name.length > 255) {
    return { valid: false, error: 'File name is too long' }
  }

  return { valid: true, value: file }
}

/**
 * Rate limiting helper (client-side)
 * Prevents spam by limiting function calls
 */
export const createRateLimiter = (maxCalls, timeWindow) => {
  const calls = []

  return () => {
    const now = Date.now()
    const windowStart = now - timeWindow

    // Remove old calls outside the time window
    while (calls.length > 0 && calls[0] < windowStart) {
      calls.shift()
    }

    // Check if limit exceeded
    if (calls.length >= maxCalls) {
      return {
        allowed: false,
        error: 'Rate limit exceeded. Please try again later.',
      }
    }

    // Record this call
    calls.push(now)

    return { allowed: true }
  }
}

/**
 * Secure localStorage wrapper
 * Prevents errors and provides fallback
 */
export const secureStorage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Error writing to localStorage:', error)
      return false
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  },

  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  },
}

/**
 * Mask sensitive data for display
 * Shows only last 4 characters
 */
export const maskSensitiveData = (data, visibleChars = 4) => {
  if (typeof data !== 'string' || data.length <= visibleChars) {
    return data
  }

  const visible = data.slice(-visibleChars)
  const masked = '*'.repeat(data.length - visibleChars)

  return masked + visible
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - {valid: boolean, strength: number, errors: Array}
 */
export const validatePassword = (password) => {
  const errors = []
  let strength = 0

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  } else {
    strength += 1
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  } else {
    strength += 1
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  } else {
    strength += 1
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  } else {
    strength += 1
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  } else {
    strength += 1
  }

  // Check for common passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123', 'admin', 'letmein']
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Password is too common. Please choose a more unique password.')
    strength = Math.max(0, strength - 2)
  }

  return {
    valid: errors.length === 0,
    strength: Math.min(5, strength),
    errors
  }
}

/**
 * Generate CSRF token
 * @returns {string} - CSRF token
 */
export const generateCSRFToken = () => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Audit logging for security events
 */
const auditLog = []

export const logSecurityEvent = (action, details = {}) => {
  const event = {
    timestamp: new Date().toISOString(),
    action,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href
  }

  auditLog.push(event)

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('🔒 Security Event:', event)
  }

  // Keep only last 100 events to prevent memory issues
  if (auditLog.length > 100) {
    auditLog.shift()
  }

  // In production, you should send to server
  // sendToServer('/api/audit-log', event)
}

export const getAuditLog = (limit = 50) => {
  return auditLog.slice(-limit)
}

/**
 * Secure session storage with expiration
 */
export const secureSessionStorage = {
  set: (key, value, expiresInMs = 60 * 60 * 1000) => {
    try {
      const item = {
        value,
        expires: Date.now() + expiresInMs,
        checksum: generateChecksum(JSON.stringify(value))
      }
      sessionStorage.setItem(`sec_${key}`, JSON.stringify(item))
      return true
    } catch (error) {
      console.error('Error writing to sessionStorage:', error)
      return false
    }
  },

  get: (key) => {
    try {
      const itemStr = sessionStorage.getItem(`sec_${key}`)
      if (!itemStr) return null

      const item = JSON.parse(itemStr)

      // Check expiration
      if (Date.now() > item.expires) {
        sessionStorage.removeItem(`sec_${key}`)
        return null
      }

      // Verify checksum
      const currentChecksum = generateChecksum(JSON.stringify(item.value))
      if (currentChecksum !== item.checksum) {
        console.warn('Session data integrity check failed')
        sessionStorage.removeItem(`sec_${key}`)
        return null
      }

      return item.value
    } catch (error) {
      console.error('Error reading from sessionStorage:', error)
      return null
    }
  },

  remove: (key) => {
    try {
      sessionStorage.removeItem(`sec_${key}`)
      return true
    } catch (error) {
      console.error('Error removing from sessionStorage:', error)
      return false
    }
  }
}

/**
 * Generate simple checksum for data integrity
 */
function generateChecksum(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(36)
}

/**
 * Sanitize filename for safe file operations
 */
export const sanitizeFilename = (filename) => {
  if (typeof filename !== 'string') return ''

  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars
    .replace(/\.{2,}/g, '.') // Prevent directory traversal
    .replace(/^\./, '') // Remove leading dot
    .slice(0, 255) // Limit length
}
