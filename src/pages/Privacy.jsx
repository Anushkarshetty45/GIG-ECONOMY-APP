import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Lock, Eye, Database, UserX, FileText } from 'lucide-react'
import './DashboardPages.css'

export default function Privacy() {
  const navigate = useNavigate()

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Account Information",
          text: "When you create an account, we collect your email address and encrypted password. We never store your password in plain text."
        },
        {
          subtitle: "Financial Data",
          text: "You voluntarily provide income, expense, goal, and insurance data. This data is stored securely in our encrypted database and is only accessible to you."
        },
        {
          subtitle: "Usage Information",
          text: "We collect basic usage analytics (page views, feature usage) to improve the app. This data is anonymized and cannot be linked to you personally."
        }
      ]
    },
    {
      icon: Lock,
      title: "How We Protect Your Data",
      content: [
        {
          subtitle: "Encryption",
          text: "All data is encrypted in transit using HTTPS/SSL and at rest using AES-256 encryption. Your financial information is as secure as online banking."
        },
        {
          subtitle: "Authentication",
          text: "We use JWT (JSON Web Tokens) for secure authentication. Sessions expire automatically, and you can log out from all devices anytime."
        },
        {
          subtitle: "Database Security",
          text: "Row Level Security (RLS) ensures you can only access your own data. Even our team cannot access your financial information without your explicit permission."
        }
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Data",
      content: [
        {
          subtitle: "Provide Services",
          text: "We use your data solely to provide the features you expect: tracking income/expenses, calculating taxes, setting goals, and generating reports."
        },
        {
          subtitle: "Improve The App",
          text: "Anonymized usage data helps us understand which features are most valuable and where we can improve the user experience."
        },
        {
          subtitle: "Communication",
          text: "We may send important account-related emails (password resets, security alerts). Marketing emails are opt-in only and you can unsubscribe anytime."
        }
      ]
    },
    {
      icon: UserX,
      title: "What We Don't Do",
      content: [
        {
          subtitle: "We Don't Sell Your Data",
          text: "Never. Your financial information is not for sale. We don't sell, rent, or share your data with advertisers or third parties."
        },
        {
          subtitle: "We Don't Share Without Permission",
          text: "Your data stays private. We only share data if legally required (court order) or with your explicit consent for specific integrations you enable."
        },
        {
          subtitle: "We Don't Use Tracking Cookies",
          text: "We don't use third-party advertising cookies or trackers. The only cookies we use are essential for authentication and app functionality."
        }
      ]
    },
    {
      icon: FileText,
      title: "Your Rights",
      content: [
        {
          subtitle: "Access Your Data",
          text: "You can view, export, and download all your data anytime via the Export page. Your data belongs to you."
        },
        {
          subtitle: "Delete Your Data",
          text: "Request account deletion anytime from Settings. We'll permanently delete all your data within 30 days. This action is irreversible."
        },
        {
          subtitle: "Correct Your Data",
          text: "Edit or update any information in your account anytime. You have full control over your data accuracy."
        },
        {
          subtitle: "Opt-Out of Marketing",
          text: "Unsubscribe from promotional emails instantly via the unsubscribe link. Essential security emails cannot be disabled."
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
          <Shield size={36} strokeWidth={2.5} />
          Privacy Policy
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
          At <strong>GIG ECONOMY</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, protect, and handle your personal and financial information when you use our financial tracking application.
        </p>
        <p style={{ fontSize: '15px', color: 'var(--theme-text)', lineHeight: '1.8' }}>
          <strong>Our Promise:</strong> Your financial data is yours. We don't sell it, we don't share it, and we use bank-level security to protect it. You can export or delete your data anytime.
        </p>
      </div>

      {/* Privacy Sections */}
      {sections.map((section, idx) => {
        const IconComponent = section.icon
        return (
          <div key={idx} className="dashboard-section" style={{ marginBottom: '32px' }}>
            <h2 className="section-title" style={{
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <IconComponent size={24} strokeWidth={2} />
              {section.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {section.content.map((item, itemIdx) => (
                <div
                  key={itemIdx}
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
                    marginBottom: '12px'
                  }}>
                    {item.subtitle}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--theme-text-secondary)',
                    lineHeight: '1.7'
                  }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Third-Party Services */}
      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title" style={{ marginBottom: '24px' }}>
          Third-Party Services
        </h2>
        <div style={{
          background: 'var(--theme-card)',
          border: '1px solid var(--theme-border)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7', marginBottom: '12px' }}>
            We use the following trusted third-party services to provide our app:
          </p>
          <ul style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li><strong>Supabase:</strong> Database and authentication. Data stored in secure PostgreSQL database with encryption.</li>
            <li><strong>Vercel/Netlify:</strong> Hosting provider with automatic HTTPS/SSL encryption.</li>
            <li><strong>Plaid (Optional):</strong> If you enable bank linking, Plaid securely connects to your bank. We never see your banking credentials.</li>
          </ul>
        </div>
      </div>

      {/* Data Retention */}
      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title" style={{ marginBottom: '24px' }}>
          Data Retention
        </h2>
        <div style={{
          background: 'var(--theme-card)',
          border: '1px solid var(--theme-border)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7' }}>
            We retain your data for as long as your account is active. If you delete your account, all data is permanently deleted within 30 days. Backups are retained for 90 days for disaster recovery, then permanently deleted.
          </p>
        </div>
      </div>

      {/* Children's Privacy */}
      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title" style={{ marginBottom: '24px' }}>
          Children's Privacy
        </h2>
        <div style={{
          background: 'var(--theme-card)',
          border: '1px solid var(--theme-border)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7' }}>
            Our service is not intended for children under 18. We do not knowingly collect data from children. If you're a parent and believe your child has provided us with personal information, please contact us immediately.
          </p>
        </div>
      </div>

      {/* Changes to Policy */}
      <div className="dashboard-section" style={{ marginBottom: '32px' }}>
        <h2 className="section-title" style={{ marginBottom: '24px' }}>
          Changes to This Policy
        </h2>
        <div style={{
          background: 'var(--theme-card)',
          border: '1px solid var(--theme-border)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)', lineHeight: '1.7' }}>
            We may update this Privacy Policy from time to time. We'll notify you of significant changes via email. Continued use of the app after changes constitutes acceptance of the updated policy. The "Last Updated" date at the top shows when changes were made.
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
          Questions About Privacy?
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--theme-text-secondary)', marginBottom: '24px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          If you have any questions or concerns about our privacy practices, please don't hesitate to contact us.
        </p>
        <a
          href="mailto:privacy@gigeconomyapp.com?subject=Privacy%20Question"
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
          Contact Privacy Team
        </a>
      </div>
    </div>
  )
}
