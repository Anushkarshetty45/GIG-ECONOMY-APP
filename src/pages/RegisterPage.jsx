import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import './AuthPages.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { signUp, loading, error } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  })
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await signUp(formData.email, formData.password, {
      full_name: formData.fullName
    })

    if (result.success) {
      setRegistrationSuccess(true)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>GIG ECONOMY</h1>
          <p>{registrationSuccess ? 'Check your email' : 'Create your free account'}</p>
        </div>

        {registrationSuccess ? (
          <div className="success-container">
            <div className="success-icon">📧</div>
            <h2 style={{ color: '#34d399', marginBottom: '16px' }}>Registration Successful!</h2>
            <p style={{ color: '#9ca3af', marginBottom: '24px', lineHeight: '1.6' }}>
              We've sent a confirmation email to <strong style={{ color: '#e5e5e5' }}>{formData.email}</strong>.
              Please check your inbox and click the confirmation link to activate your account.
            </p>
            <p style={{ color: '#9ca3af', marginBottom: '24px', fontSize: '14px' }}>
              After confirming your email, you'll be redirected to the login page.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="auth-button"
              style={{ marginTop: '16px' }}
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="auth-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  required
                />
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="auth-footer">
              Already have an account? <Link to="/login">Sign In</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
