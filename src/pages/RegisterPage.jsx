import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../config/supabase'
import './AuthPages.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { loading, error, setError } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  })
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otp, setOtp] = useState('')
  const [verifyingOtp, setVerifyingOtp] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Sign up with Supabase - this sends OTP email
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          },
          emailRedirectTo: `${window.location.origin}/login`,
        }
      })

      if (error) throw error

      // Show OTP input after successful registration
      setShowOtpInput(true)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setVerifyingOtp(true)

    try {
      // Verify the OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: otp,
        type: 'signup'
      })

      if (error) throw error

      // OTP verified successfully - redirect to login
      alert('Email verified successfully! Please login with your credentials.')
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.')
    } finally {
      setVerifyingOtp(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>GIG ECONOMY</h1>
          <p>{showOtpInput ? 'Verify your email' : 'Create your free account'}</p>
        </div>

        {showOtpInput ? (
          <div className="success-container">
            <div className="success-icon">📧</div>
            <h2 style={{ color: '#34d399', marginBottom: '16px' }}>Check Your Email!</h2>
            <p style={{ color: '#9ca3af', marginBottom: '24px', lineHeight: '1.6' }}>
              We've sent a 6-digit verification code to <strong style={{ color: '#e5e5e5' }}>{formData.email}</strong>.
              Please enter the code below to verify your email.
            </p>

            <form onSubmit={handleVerifyOtp} className="auth-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label>Enter 6-Digit OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength="6"
                  pattern="[0-9]{6}"
                  required
                  style={{
                    textAlign: 'center',
                    fontSize: '24px',
                    letterSpacing: '8px',
                    fontWeight: 'bold'
                  }}
                />
              </div>

              <button type="submit" className="auth-button" disabled={verifyingOtp}>
                {verifyingOtp ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            <p style={{ color: '#9ca3af', marginTop: '16px', fontSize: '14px' }}>
              Didn't receive the code? Check your spam folder or{' '}
              <span
                onClick={() => setShowOtpInput(false)}
                style={{ color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}
              >
                try again
              </span>
            </p>
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
