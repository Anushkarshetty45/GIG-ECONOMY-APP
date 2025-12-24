import { useNavigate } from 'react-router-dom'
import { ArrowLeft, HelpCircle, MessageCircle, Book, Mail, Github, Search } from 'lucide-react'
import './DashboardPages.css'

export default function HelpCenter() {
  const navigate = useNavigate()

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click 'Get Started Free' or 'Sign Up' and enter your email and password. You'll receive a verification email to confirm your account."
        },
        {
          q: "Is the app really free?",
          a: "Yes! The Free plan includes unlimited transactions, basic analytics, 3 savings goals, tax tools, and CSV export - forever free. Upgrade to PRO for advanced features."
        },
        {
          q: "How do I add income?",
          a: "Go to Income page → Click '+ Add Income' → Select platform, enter amount, date, and optional notes → Save. Your income will appear in the dashboard."
        }
      ]
    },
    {
      category: "Features & Functionality",
      questions: [
        {
          q: "How does the tax calculator work?",
          a: "Our tax tool analyzes your income and deductible expenses, then calculates quarterly tax estimates at 25%. It tracks 5 deductible categories: Gas, Office Supplies, Equipment, Software, and Travel."
        },
        {
          q: "What are the 9 themes?",
          a: "Choose from Pure White, Midnight Black, Soft Pastels, Coral Sunset, Lavender Dream, Mint Fresh, Ocean Breeze, Midnight Latte, and Seasonal (auto-changes with seasons). Access via Settings."
        },
        {
          q: "Can I export my data?",
          a: "Yes! Go to Export page → Select date range → Choose CSV or PDF format → Download. You own your data and can export anytime."
        }
      ]
    },
    {
      category: "Security & Privacy",
      questions: [
        {
          q: "Is my financial data secure?",
          a: "Absolutely. We use bank-level 256-bit encryption, JWT authentication, Row Level Security in Supabase, and Content Security Policy. Your data is never shared with third parties."
        },
        {
          q: "Do you sell my data?",
          a: "Never. We don't sell, rent, or share your personal or financial data. Our privacy-first approach means your data stays yours."
        },
        {
          q: "How do I delete my account?",
          a: "Go to Settings → Account → Delete Account. This permanently removes all your data from our servers. This action cannot be undone."
        }
      ]
    },
    {
      category: "Billing & Subscription",
      questions: [
        {
          q: "How does the PRO trial work?",
          a: "Start a 30-day free trial of PRO features. Cancel anytime during the trial without being charged. After trial, it's $9/month or $89/year."
        },
        {
          q: "Can I cancel my PRO subscription?",
          a: "Yes, cancel anytime from Settings → Subscription. You'll keep PRO features until the end of your billing period, then downgrade to Free."
        },
        {
          q: "Do you offer refunds?",
          a: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact support within 30 days for a full refund."
        }
      ]
    },
    {
      category: "Troubleshooting",
      questions: [
        {
          q: "I forgot my password",
          a: "Click 'Forgot Password' on the login page → Enter your email → Check your inbox for reset link → Create a new password."
        },
        {
          q: "The app won't load",
          a: "Try: 1) Refresh the page (Cmd+R), 2) Clear browser cache, 3) Try a different browser, 4) Check your internet connection. Still issues? Contact support."
        },
        {
          q: "My charts aren't showing",
          a: "Charts require at least 2 data points. Add more income/expense entries with different dates. If issue persists, try refreshing the page."
        }
      ]
    }
  ]

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
          <HelpCircle size={36} strokeWidth={2.5} />
          Help Center
        </h1>
        <p style={{ color: 'var(--theme-text-tertiary)', fontSize: '15px', marginLeft: '48px' }}>
          Find answers to common questions and get help with your account
        </p>
      </div>

      {/* Quick Links */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '48px'
      }}>
        <div style={{
          background: 'var(--theme-surface)',
          border: '1px solid var(--theme-border)',
          borderRadius: '12px',
          padding: '24px',
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <MessageCircle size={32} color="var(--theme-primary)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--theme-text)', marginBottom: '8px' }}>
            Contact Support
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', marginBottom: '12px' }}>
            Get help from our team
          </p>
          <a href="mailto:support@gigeconomyapp.com" style={{ color: 'var(--theme-primary)', fontSize: '14px', textDecoration: 'none' }}>
            support@gigeconomyapp.com
          </a>
        </div>

        <div style={{
          background: 'var(--theme-surface)',
          border: '1px solid var(--theme-border)',
          borderRadius: '12px',
          padding: '24px',
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        onClick={() => window.open('https://github.com/Anushkarshetty45/GIG-ECONOMY-APP', '_blank')}
        >
          <Book size={32} color="var(--theme-success)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--theme-text)', marginBottom: '8px' }}>
            Documentation
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', marginBottom: '12px' }}>
            Read our guides & README
          </p>
          <span style={{ color: 'var(--theme-success)', fontSize: '14px', textDecoration: 'none' }}>
            View Documentation →
          </span>
        </div>

        <div style={{
          background: 'var(--theme-surface)',
          border: '1px solid var(--theme-border)',
          borderRadius: '12px',
          padding: '24px',
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        onClick={() => window.location.href = 'mailto:community@gigeconomyapp.com?subject=Join%20Community&body=Hi!%20I%27d%20like%20to%20join%20the%20GIG%20ECONOMY%20community.'}
        >
          <Github size={32} color="var(--theme-warning)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--theme-text)', marginBottom: '8px' }}>
            Community
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', marginBottom: '12px' }}>
            Connect with other users
          </p>
          <span style={{ color: 'var(--theme-warning)', fontSize: '14px', textDecoration: 'none' }}>
            Join Community →
          </span>
        </div>
      </div>

      {/* FAQ Sections */}
      {faqs.map((section, idx) => (
        <div key={idx} className="dashboard-section" style={{ marginBottom: '32px' }}>
          <h2 className="section-title" style={{ marginBottom: '24px' }}>
            {section.category}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {section.questions.map((faq, faqIdx) => (
              <div
                key={faqIdx}
                style={{
                  background: 'var(--theme-card)',
                  border: '1px solid var(--theme-border)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--theme-text)',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Search size={18} color="var(--theme-primary)" />
                  {faq.q}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--theme-text-secondary)',
                  lineHeight: '1.6',
                  marginLeft: '26px'
                }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Still Need Help */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)',
        border: '1px solid rgba(33, 150, 243, 0.3)',
        borderRadius: '16px',
        padding: '32px',
        textAlign: 'center',
        marginTop: '48px'
      }}>
        <Mail size={48} color="var(--theme-primary)" style={{ marginBottom: '16px', marginLeft: 'auto', marginRight: 'auto' }} />
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--theme-text)', marginBottom: '12px' }}>
          Still Need Help?
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--theme-text-secondary)', marginBottom: '24px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          Can't find what you're looking for? Our support team is here to help you with any questions or issues.
        </p>
        <a
          href="mailto:support@gigeconomyapp.com?subject=Help%20Request"
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
          Contact Support
        </a>
      </div>
    </div>
  )
}
