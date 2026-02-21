# Security Documentation

This document outlines the security measures implemented in the Gig Economy App.

## = Security Features Implemented

### 1. **Content Security Policy (CSP)**
- **Prevents XSS attacks** by controlling which resources can be loaded
- **Blocks inline scripts** and unsafe eval where possible
- **Restricts frame ancestors** to prevent clickjacking
- **Upgrades insecure requests** to HTTPS automatically
- **Whitelists trusted CDNs** (Supabase, Stripe, Tesseract.js)

### 2. **Input Sanitization**
All user inputs are sanitized to prevent:
- **XSS (Cross-Site Scripting)** attacks
- **SQL Injection** (though using Supabase RPC/ORM)
- **HTML Injection**

**Functions available in `src/utils/security.js`:**
- `sanitizeString()` - Removes HTML tags and dangerous content
- `sanitizeFilename()` - Prevents directory traversal in file uploads
- `sanitizeObject()` - Recursively sanitizes all string values in objects

### 3. **Password Security**
- **Minimum 8 characters** required
- **Complexity requirements:**
  - At least one lowercase letter
  - At least one uppercase letter
  - At least one number
  - At least one special character
- **Common password detection** - Rejects easily guessable passwords
- **Password strength meter** - 5-level strength indicator

**Usage:**
```javascript
import { validatePassword } from '../utils/security'

const result = validatePassword('myP@ssw0rd')
console.log(result.valid, result.strength, result.errors)
```

### 4. **Rate Limiting**
Prevents brute force attacks by limiting:
- **Login attempts:** 5 attempts per 15 minutes
- **Signup attempts:** 3 attempts per hour

**Usage:**
```javascript
import { createRateLimiter } from '../utils/security'

const limiter = createRateLimiter(5, 15 * 60 * 1000)
const result = limiter()
if (!result.allowed) {
  // Show error to user
}
```

### 5. **Audit Logging**
All security-sensitive actions are logged:
- Login attempts (success/failure)
- Signup attempts
- Password changes
- Password reset requests
- Rate limit violations
- Logout events

**View logs:**
```javascript
import { getAuditLog } from '../utils/security'

const logs = getAuditLog(50) // Last 50 events
```

### 6. **Secure Session Management**
- **Auto-refresh tokens** via Supabase
- **Session expiration** checking
- **Session integrity verification** using checksums
- **Secure session storage** with expiration

### 7. **CSRF Protection**
- **CSRF token generation** for sensitive operations
- **Token validation** before processing requests

**Usage:**
```javascript
import { generateCSRFToken, validateCSRFToken } from '../utils/security'

const token = generateCSRFToken()
// Store in session/state
// Validate on form submission
```

### 8. **File Upload Security**
- **File type validation** - Only allowed types can be uploaded
- **File size limits** - Maximum 10MB for receipts
- **Filename sanitization** - Prevents directory traversal
- **Content type verification**

### 9. **Data Validation**
Comprehensive validation for:
- Email addresses
- Phone numbers
- Amounts/currency
- Dates
- URLs
- Numbers (with min/max/decimal constraints)

### 10. **Secure Storage**
- **Environment variables** for sensitive config (.env files)
- **Never commit secrets** to Git (.gitignore configured)
- **Obfuscated localStorage** for sensitive client data
- **Session-based storage** with expiration

## =á Security Headers

The following HTTP security headers are configured:

| Header | Value | Purpose |
|--------|-------|---------|
| Content-Security-Policy | Strict policy | Prevents XSS, clickjacking |
| X-Content-Type-Options | nosniff | Prevents MIME-sniffing |
| X-Frame-Options | DENY | Prevents clickjacking |
| X-XSS-Protection | 1; mode=block | Legacy XSS protection |
| Referrer-Policy | strict-origin-when-cross-origin | Controls referrer info |
| Permissions-Policy | Restrictive | Disables unnecessary features |
| X-DNS-Prefetch-Control | off | Prevents DNS leakage |

## = Authentication Flow

1. **Signup:**
   - Email sanitization
   - Password strength validation
   - Rate limiting check
   - Security event logging
   - Supabase user creation

2. **Login:**
   - Email sanitization
   - Rate limiting check
   - Security event logging
   - Supabase authentication
   - Session creation

3. **Password Reset:**
   - Email sanitization
   - Rate limiting
   - Secure token generation
   - Email verification

4. **Password Change:**
   - Password strength validation
   - Old password verification
   - Security event logging

## =Ë Best Practices

### For Developers:

1. **Always sanitize user input** before processing or displaying
2. **Use security utilities** from `src/utils/security.js`
3. **Never commit .env files** to version control
4. **Log security events** for monitoring
5. **Validate on both client and server** (defense in depth)
6. **Use HTTPS only** in production
7. **Keep dependencies updated** regularly
8. **Review audit logs** periodically

### For Users:

1. **Use strong, unique passwords** for your account
2. **Enable two-factor authentication** (when available)
3. **Don't share your password** with anyone
4. **Log out on shared devices**
5. **Review account activity** regularly
6. **Report suspicious activity** immediately

## =¨ Incident Response

If you discover a security vulnerability:

1. **Do NOT** create a public GitHub issue
2. **Email security concerns** to the development team
3. **Provide details:** Steps to reproduce, impact, affected versions
4. **Wait for acknowledgment** before public disclosure

## = Security Updates

Security features are regularly updated. Check this file and commit history for changes.

**Last Updated:** 2026-02-21

##   Known Limitations

1. **Client-side rate limiting** can be bypassed by clearing browser storage (should be implemented server-side for production)
2. **Audit logs** are stored in memory (should be sent to server in production)
3. **localStorage** is not truly secure (sensitive data should be minimized)
4. **CSP allows 'unsafe-inline'** and 'unsafe-eval' for compatibility (can be tightened)

## <¯ Future Security Enhancements

- [ ] Implement server-side rate limiting
- [ ] Add IP-based blocking for repeated failures
- [ ] Implement account lockout after multiple failed attempts
- [ ] Add email verification for signups
- [ ] Implement two-factor authentication (2FA)
- [ ] Add session timeout warnings
- [ ] Implement suspicious activity detection
- [ ] Add CAPTCHA for sensitive operations
- [ ] Implement Content Security Policy reporting
- [ ] Add security headers via server configuration
- [ ] Implement subresource integrity (SRI) for CDN resources

## =Ú References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

**Remember:** Security is an ongoing process, not a one-time implementation. Stay vigilant!
