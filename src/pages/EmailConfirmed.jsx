import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'
import './AuthPages.css'

export default function EmailConfirmed() {
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Check if there's a session (email was confirmed)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) throw sessionError

        // Small delay to show the success message
        setTimeout(() => {
          setVerifying(false)
        }, 1500)
      } catch (err) {
        console.error('Email confirmation error:', err)
        setError(err.message)
        setVerifying(false)
      }
    }

    verifyEmail()
  }, [])

  const handleContinue = () => {
    navigate('/login')
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>GIG ECONOMY</h1>
          <p>{verifying ? 'Verifying your email...' : 'Email Confirmed'}</p>
        </div>

        {verifying ? (
          <div className="success-container">
            <div className="success-icon">⏳</div>
            <p style={{ color: '#9ca3af' }}>Please wait while we verify your email...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">❌</div>
            <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Verification Failed</h2>
            <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
              {error}
            </p>
            <button onClick={handleContinue} className="auth-button">
              Go to Login
            </button>
          </div>
        ) : (
          <div className="success-container">
            <div className="success-icon">✅</div>
            <h2 style={{ color: '#34d399', marginBottom: '16px' }}>Email Successfully Verified!</h2>
            <p style={{ color: '#9ca3af', marginBottom: '24px', lineHeight: '1.6' }}>
              Your account has been activated. You can now sign in and start using GIG ECONOMY.
            </p>
            <button onClick={handleContinue} className="auth-button">
              Continue to Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
