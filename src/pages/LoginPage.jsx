import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import './AuthPages.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { signIn, loading, error } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [emailConfirmed, setEmailConfirmed] = useState(false)

  useEffect(() => {
    // Check if user just confirmed their email (hash params from Supabase)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const type = hashParams.get('type')

    if (type === 'signup' || type === 'email') {
      setEmailConfirmed(true)
      // Clear the success message after 5 seconds
      setTimeout(() => setEmailConfirmed(false), 5000)
      // Clear the hash from URL
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await signIn(formData.email, formData.password)

    if (result.success) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>GIG ECONOMY</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {emailConfirmed && (
            <div style={{
              background: 'rgba(52, 211, 153, 0.1)',
              border: '1px solid #34d399',
              color: '#34d399',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              ✅ Email verified successfully! You can now log in.
            </div>
          )}
          {error && <div className="error-message">{error}</div>}

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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create Account</Link>
        </div>
      </div>
    </div>
  )
}
