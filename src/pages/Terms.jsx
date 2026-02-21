import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, CheckCircle, XCircle, AlertTriangle, Scale } from 'lucide-react'
import './DashboardPages.css'

export default function Terms() {
  const navigate = useNavigate()

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--theme-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            marginBottom: '16px',
            padding: '8px 0'
          }}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
        <h1 style={{
          color: 'var(--theme-text)',
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <FileText size={36} strokeWidth={2.5} />
          Terms of Service
        </h1>
        <p style={{ color: 'var(--theme-text-tertiary)', fontSize: '15px', marginLeft: '48px' }}>
          Last Updated: December 24, 2025
        </p>
      </div>

      {/* Introduction */}
      <div style={{
        background: 'var(--theme-surface)',
        border: '1px solid var(--theme-border)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px'
      }}>
        <p style={{ fontSize: '15px', color: 'var(--theme-text)', lineHeight: '1.8', marginBottom: '16px' }}>
          Welcome to <strong>GIG ECONOMY</strong>! By accessing or using our financial tracking application, you agree to be bound by these Terms of Service. Please read them carefully.
        </p>
        <p style={{ fontSize: '15px', color: 'var(--theme-text)', lineHeight: '1.8' }}>
          <strong>Quick Summary:</strong> Use our app responsibly for tracking your finances. We provide the tools, you own your data. Don't abuse the service or violate laws. We're not liable for financial decisions you make.
        </p>
      </div>

      {/* Acceptance of Terms */}
      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Scale size={24} strokeWidth={2} />
          1. Acceptance of Terms
        </h2>
        <div style={{
          background: 'var(--theme-card)',
          border: '1px solid var(--theme-border)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7', marginBottom: '12px' }}>
            By creating an account or using GIG ECONOMY, you confirm that:
          </p>
          <ul style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>You are at least 18 years old</li>
            <li>You have the legal capacity to enter into this agreement</li>
            <li>You will comply with all applicable laws and regulations</li>
            <li>All information you provide is accurate and truthful</li>
          </ul>
        </div>
      </div>

      {/* User Responsibilities */}
      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle size={24} strokeWidth={2} />
          2. Your Responsibilities
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'var(--theme-card)',
            border: '1px solid var(--theme-border)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--theme-text)', marginBottom: '12px' }}>
              Account Security
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7' }}>
              You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately if you suspect unauthorized access. You are liable for all activities under your account.
            </p>
          </div>

          <div style={{
            background: 'var(--theme-card)',
            border: '1px solid var(--theme-border)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--theme-text)', marginBottom: '12px' }}>
              Accurate Information
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7' }}>
              You are responsible for the accuracy of all financial data you enter. We provide tools for tracking, but we don't verify the data you input. Review all information carefully before using it for tax or financial decisions.
            </p>
          </div>

          <div style={{
            background: 'var(--theme-card)',
            border: '1px solid var(--theme-border)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--theme-text)', marginBottom: '12px' }}>
              Lawful Use
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7' }}>
              Use the app only for legitimate financial tracking purposes. Don't use it for money laundering, tax evasion, fraud, or any illegal activities. Violations may result in account termination and legal action.
            </p>
          </div>
        </div>
      </div>

      {/* Prohibited Activities */}
      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <XCircle size={24} strokeWidth={2} />
          3. Prohibited Activities
        </h2>
        <div style={{
          background: 'var(--theme-card)',
          border: '1px solid var(--theme-border)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7', marginBottom: '12px' }}>
            You agree NOT to:
          </p>
          <ul style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Attempt to hack, reverse engineer, or compromise the app's security</li>
            <li>Use automated scripts, bots, or scrapers without permission</li>
            <li>Share your account with others or create multiple accounts</li>
            <li>Upload malware, viruses, or malicious code</li>
            <li>Harass, abuse, or spam other users or our support team</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Resell or redistribute the app without authorization</li>
          </ul>
        </div>
      </div>

      {/* Data Ownership */}
      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title" style={{ marginBottom: '24px' }}>
          4. Data Ownership
        </h2>
        <div style={{
          background: 'var(--theme-card)',
          border: '1px solid var(--theme-border)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7', marginBottom: '12px' }}>
            <strong>Your Data:</strong> You retain full ownership of all data you enter into the app (income, expenses, goals, etc.). You can export or delete your data anytime.
          </p>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7' }}>
            <strong>Our Content:</strong> The app itself, including code, design, features, and branding, is owned by GIG ECONOMY and protected by copyright and intellectual property laws.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={24} strokeWidth={2} />
          5. Disclaimer & Limitation of Liability
        </h2>
        <div style={{
          background: 'rgba(255, 152, 0, 0.1)',
          border: '1px solid rgba(255, 152, 0, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <p style={{ fontSize: '14px', color: 'var(--theme-text)', lineHeight: '1.7', marginBottom: '12px' }}>
            <strong>Important:</strong> This app is provided "AS IS" without warranties of any kind. We make no guarantees about accuracy, reliability, or availability.
          </p>
          <ul style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '12px' }}>
            <li><strong>Not Financial Advice:</strong> We provide tracking tools, not financial, tax, or legal advice. Consult professionals for important decisions.</li>
            <li><strong>No Liability:</strong> We're not liable for financial losses, tax penalties, or damages resulting from using the app or data inaccuracies.</li>
            <li><strong>Tax Calculations:</strong> Tax estimates are approximations. Consult a tax professional for accurate filing.</li>
            <li><strong>Third-Party Services:</strong> We're not responsible for issues with Plaid, Stripe, or other third-party integrations.</li>
          </ul>
          <p style={{ fontSize: '13px', color: 'var(--theme-text-tertiary)', lineHeight: '1.7' }}>
            Maximum liability is limited to the amount you paid us in the past 12 months (for free users: $0).
          </p>
        </div>
      </div>

      {/* Subscription & Payment */}
      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title" style={{ marginBottom: '24px' }}>
          6. Subscription & Payment
        </h2>
        <div style={{
          background: 'var(--theme-card)',
          border: '1px solid var(--theme-border)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--theme-text)', marginBottom: '12px' }}>
            Free Plan
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7', marginBottom: '16px' }}>
            The Free plan is free forever with basic features. We may change feature limits with 30 days notice.
          </p>

          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--theme-text)', marginBottom: '12px' }}>
            PRO Plan
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7', marginBottom: '8px' }}>
            PRO subscriptions are billed monthly ($9) or annually ($89). Payment processed via Stripe.
          </p>
          <ul style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '16px' }}>
            <li>30-day free trial for new users</li>
            <li>Auto-renewal unless canceled</li>
            <li>Cancel anytime - no penalties</li>
            <li>30-day money-back guarantee</li>
            <li>Pro-rated refunds not available mid-billing cycle</li>
          </ul>

          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--theme-text)', marginBottom: '12px' }}>
            Price Changes
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7' }}>
            We may change pricing with 60 days notice. Existing subscribers keep current pricing for 12 months after notice.
          </p>
        </div>
      </div>

      {/* Termination */}
      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title" style={{ marginBottom: '24px' }}>
          7. Termination
        </h2>
        <div style={{
          background: 'var(--theme-card)',
          border: '1px solid var(--theme-border)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7', marginBottom: '12px' }}>
            <strong>By You:</strong> Delete your account anytime from Settings. All data is permanently deleted within 30 days.
          </p>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7' }}>
            <strong>By Us:</strong> We may suspend or terminate accounts that violate these Terms, engage in illegal activity, or abuse the service. We'll provide notice when possible, but may terminate immediately for severe violations.
          </p>
        </div>
      </div>

      {/* Changes to Terms */}
      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title" style={{ marginBottom: '24px' }}>
          8. Changes to Terms
        </h2>
        <div style={{
          background: 'var(--theme-card)',
          border: '1px solid var(--theme-border)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7' }}>
            We may update these Terms from time to time. Material changes will be notified via email 30 days before taking effect. Continued use after changes constitutes acceptance. If you disagree, you may delete your account before the effective date.
          </p>
        </div>
      </div>

      {/* Governing Law */}
      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title" style={{ marginBottom: '24px' }}>
          9. Governing Law
        </h2>
        <div style={{
          background: 'var(--theme-card)',
          border: '1px solid var(--theme-border)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7' }}>
            These Terms are governed by the laws of your jurisdiction. Disputes will be resolved through arbitration or small claims court.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)',
        border: '1px solid rgba(33, 150, 243, 0.3)',
        borderRadius: '16px',
        padding: '32px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--theme-text)', marginBottom: '12px' }}>
          Questions About These Terms?
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--theme-text-secondary)', marginBottom: '24px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          If you have any questions about our Terms of Service, please contact us.
        </p>
        <a
          href="mailto:legal@gigeconomyapp.com?subject=Terms%20Question"
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: 'var(--theme-primary)',
            color: '#ffffff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '15px'
          }}
        >
          Contact Legal Team
        </a>
      </div>
    </div>
  )
}
