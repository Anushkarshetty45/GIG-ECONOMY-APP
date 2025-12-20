/**
 * Validation Utilities
 * Provides input validation and sanitization for security
 */

/**
 * Validate password - accepts any non-empty password
 */
export const validatePassword = (password) => {
  if (!password || password.length === 0) {
    return { valid: false, errors: ['Password is required'] };
  }

  return {
    valid: true,
    errors: [],
    strength: 4
  };
};

/**
 * Calculate password strength (0-4)
 */
const calculatePasswordStrength = (password) => {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
  
  return Math.min(strength, 4);
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  // Check for common typos
  const commonTypos = ['gmial.com', 'yahooo.com', 'hotmial.com'];
  const domain = email.split('@')[1];
  
  if (commonTypos.includes(domain)) {
    return { valid: false, error: 'Please check your email address for typos' };
  }

  return { valid: true };
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Sanitize numeric input
 */
export const sanitizeNumber = (input) => {
  if (typeof input === 'number') {
    return input;
  }

  const cleaned = String(input).replace(/[^\d.-]/g, '');
  const number = parseFloat(cleaned);
  
  return isNaN(number) ? 0 : number;
};

/**
 * Validate amount (positive numbers only)
 */
export const validateAmount = (amount) => {
  const sanitized = sanitizeNumber(amount);
  
  if (sanitized <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }

  if (sanitized > 999999999.99) {
    return { valid: false, error: 'Amount is too large' };
  }

  return { valid: true, sanitized };
};

/**
 * Validate description/text input
 */
export const validateDescription = (description, minLength = 1, maxLength = 500) => {
  if (!description || description.trim().length === 0) {
    return { valid: false, error: 'Description is required' };
  }

  const sanitized = sanitizeInput(description);

  if (sanitized.length < minLength) {
    return { valid: false, error: `Description must be at least ${minLength} characters` };
  }

  if (sanitized.length > maxLength) {
    return { valid: false, error: `Description must be less than ${maxLength} characters` };
  }

  return { valid: true, sanitized };
};

/**
 * Generic error message for authentication failures
 * Prevents revealing system information
 */
export const getGenericAuthError = (error) => {
  // Log actual error for debugging (server-side only)
  if (__DEV__) {
    console.warn('Auth Error:', error);
  }

  // Common error messages
  const errorMap = {
    'Invalid login credentials': 'Invalid email or password',
    'Email not confirmed': 'Please verify your email address before logging in',
    'User not found': 'Invalid email or password',
    'Invalid email': 'Please enter a valid email address',
    'Email already registered': 'This email is already registered',
    'Weak password': 'Password does not meet security requirements',
  };

  // Check if error message matches known patterns
  for (const [key, value] of Object.entries(errorMap)) {
    if (error?.includes(key)) {
      return value;
    }
  }

  // Default generic error
  return 'Authentication failed. Please try again.';
};

/**
 * Rate limiting helper (client-side)
 * Prevents rapid-fire requests
 */
class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = new Map();
  }

  checkLimit(key) {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the time window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      const oldestAttempt = Math.min(...validAttempts);
      const waitTime = Math.ceil((this.windowMs - (now - oldestAttempt)) / 1000);
      return {
        allowed: false,
        waitTime,
        message: `Too many attempts. Please try again in ${waitTime} seconds.`
      };
    }

    // Record this attempt
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);

    return {
      allowed: true,
      remainingAttempts: this.maxAttempts - validAttempts.length
    };
  }

  reset(key) {
    this.attempts.delete(key);
  }
}

// Export singleton instance for login attempts
export const loginRateLimiter = new RateLimiter(5, 300000); // 5 attempts per 5 minutes

