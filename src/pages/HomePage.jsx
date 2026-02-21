import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, DollarSign, Target, Shield, BarChart3, Receipt, Clock, FileText, CheckCircle, CreditCard } from 'lucide-react'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()
  const starsRef = useRef(null)

  useEffect(() => {
    if (starsRef.current) {
      for (let i = 0; i < 60; i++) {
        const star = document.createElement('div')
        star.className = 'star'
        star.style.left = `${Math.random() * 100}%`
        star.style.top = `${Math.random() * 100}%`
        star.style.animationDuration = `${15 + Math.random() * 15}s`
        star.style.animationDelay = `${Math.random() * 5}s`
        star.style.opacity = `${0.3 + Math.random() * 0.7}`
        starsRef.current.appendChild(star)
      }
    }
  }, [])

  return (
    <div className="homepage">
      <div className="stars-container" ref={starsRef}></div>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Financial Control<br />For Gig Workers</h1>
          <p className="hero-subtitle">
            Track income, manage expenses, and achieve financial independence with our comprehensive platform designed for freelancers and gig economy workers.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/register')}>Get Started Free</button>
            <button className="btn-glass" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        </div>
      </section>

      {/* CORE FEATURES - Like the image */}
      <section className="section core-features">
        <div className="section-content">
          <h2 className="section-emoji">Everything You Need In One Place</h2>
          <div className="section-divider"></div>

          {/* Main Feature Card */}
          <div className="main-feature-card">
            <div className="main-feature-visual">
              <div className="dashboard-preview">
                <div className="preview-header">
                  <div className="preview-title">Dashboard Overview</div>
                  <div className="preview-date">Dec 2025</div>
                </div>

                <div className="preview-cards">
                  <div className="preview-card">
                    <div className="preview-card-label">Total Income</div>
                    <div className="preview-card-value" style={{ color: 'var(--theme-success)' }}>$12,450</div>
                  </div>
                  <div className="preview-card">
                    <div className="preview-card-label">Total Expenses</div>
                    <div className="preview-card-value" style={{ color: 'var(--theme-error)' }}>$5,230</div>
                  </div>
                  <div className="preview-card">
                    <div className="preview-card-label">Net Income</div>
                    <div className="preview-card-value" style={{ color: 'var(--theme-text-tertiary)' }}>$7,220</div>
                  </div>
                </div>

                <div className="preview-section">
                  <div className="preview-section-title">Recent Transactions</div>
                  <div className="preview-transactions">
                    <div className="preview-transaction">
                      <div className="preview-transaction-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                        <DollarSign size={14} color="#10b981" />
                      </div>
                      <div className="preview-transaction-details">
                        <div className="preview-transaction-name">Uber Delivery</div>
                        <div className="preview-transaction-date">Today</div>
                      </div>
                      <div className="preview-transaction-amount" style={{ color: 'var(--theme-success)' }}>+$145.00</div>
                    </div>
                    <div className="preview-transaction">
                      <div className="preview-transaction-icon" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
                        <CreditCard size={14} color="#ef4444" />
                      </div>
                      <div className="preview-transaction-details">
                        <div className="preview-transaction-name">Gas & Fuel</div>
                        <div className="preview-transaction-date">Yesterday</div>
                      </div>
                      <div className="preview-transaction-amount" style={{ color: 'var(--theme-error)' }}>-$52.00</div>
                    </div>
                    <div className="preview-transaction">
                      <div className="preview-transaction-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                        <DollarSign size={14} color="#10b981" />
                      </div>
                      <div className="preview-transaction-details">
                        <div className="preview-transaction-name">DoorDash</div>
                        <div className="preview-transaction-date">Dec 18</div>
                      </div>
                      <div className="preview-transaction-amount" style={{ color: 'var(--theme-success)' }}>+$230.00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="main-feature-content">
              <h3 className="main-feature-title">Real-Time Income Dashboard</h3>
              <p className="main-feature-desc">
                See your earnings evolve in real-time as you complete gigs. Track daily, weekly and monthly trends across multiple platforms. Visualize trends and patterns to maximize your earning potential.
              </p>
              <ul className="main-feature-list">
                <li><CheckCircle size={18} /> Live income tracking from multiple sources</li>
                <li><CheckCircle size={18} /> Customizable date ranges and filters</li>
                <li><CheckCircle size={18} /> Export data for tax preparation</li>
                <li><CheckCircle size={18} /> Automatic currency conversion</li>
              </ul>
            </div>
          </div>

          {/* Secondary Feature Cards */}
          <div className="secondary-features-grid">
            <div className="secondary-feature-card">
              <div className="feature-icon-circle">
                <Receipt size={32} />
              </div>
              <h4 className="secondary-feature-title">Expense Management</h4>
              <p className="secondary-feature-desc">Track business expenses with receipt scanning and automatic categorization</p>
            </div>
            <div className="secondary-feature-card">
              <div className="feature-icon-circle">
                <BarChart3 size={32} />
              </div>
              <h4 className="secondary-feature-title">Advanced Reports</h4>
              <p className="secondary-feature-desc">Generate detailed financial reports and export to CSV or PDF format</p>
            </div>
            <div className="secondary-feature-card">
              <div className="feature-icon-circle">
                <Clock size={32} />
              </div>
              <h4 className="secondary-feature-title">Time Tracking</h4>
              <p className="secondary-feature-desc">Log hours worked on different projects and calculate your true hourly rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how-it-works">
        <div className="section-content">
          <h2 className="section-emoji">How It Works</h2>
          <div className="section-divider"></div>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Sign Up</h3>
                <p className="step-desc">Create your free account in under 2 minutes. No credit card required.</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Track Income & Expenses</h3>
                <p className="step-desc">Add transactions as you work. Snap receipts, categorize expenses.</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Monitor & Optimize</h3>
                <p className="step-desc">View analytics, track goals, and export reports for tax time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED FEATURES */}
      <section className="section features">
        <div className="section-content">
          <h2 className="section-emoji" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <TrendingUp size={36} /> Powerful Features
          </h2>
          <div className="section-divider"></div>
          <div className="features-grid">
            <div className="feature-card">
              <DollarSign size={48} style={{ marginBottom: '16px', color: 'var(--theme-success)' }} />
              <h3 className="feature-title">Income & Expense Tracking</h3>
              <ul className="feature-list">
                <li>Track multiple income sources</li>
                <li>Categorize expenses automatically</li>
                <li>Receipt scanner with AI</li>
                <li>Real-time financial overview</li>
              </ul>
            </div>
            <div className="feature-card">
              <TrendingUp size={48} style={{ marginBottom: '16px', color: 'var(--theme-text-tertiary)' }} />
              <h3 className="feature-title">Smart Analytics & Reports</h3>
              <ul className="feature-list">
                <li>Visual charts and graphs</li>
                <li>Income vs expense trends</li>
                <li>Export to CSV/PDF</li>
                <li>Tax-ready reports</li>
              </ul>
            </div>
            <div className="feature-card">
              <Target size={48} style={{ marginBottom: '16px', color: 'var(--theme-warning)' }} />
              <h3 className="feature-title">Goals & Tax Tools</h3>
              <ul className="feature-list">
                <li>Set and track savings goals</li>
                <li>Quarterly tax calculations</li>
                <li>Deduction tracking</li>
                <li>Financial health score</li>
              </ul>
            </div>
            <div className="feature-card">
              <Shield size={48} style={{ marginBottom: '16px', color: 'var(--theme-error)' }} />
              <h3 className="feature-title">Secure & Reliable</h3>
              <ul className="feature-list">
                <li>Bank-level encryption</li>
                <li>Automatic backups</li>
                <li>Works on all devices</li>
                <li>Privacy-first approach</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="section pricing">
        <div className="section-content">
          <h2 className="section-emoji">Simple Pricing</h2>
          <div className="section-divider"></div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3 className="pricing-name">FREE</h3>
              <div className="pricing-price-container">
                <span className="pricing-price">$0</span>
                <span className="pricing-period">/month</span>
              </div>
              <p className="pricing-forever">Forever Free</p>
              <ul className="pricing-features">
                <li>✓ Unlimited transactions</li>
                <li>✓ Basic analytics</li>
                <li>✓ 3 savings goals</li>
                <li>✓ Tax tools</li>
                <li>✓ CSV export</li>
              </ul>
              <button className="btn-pricing" onClick={() => navigate('/register')}>Get Started</button>
            </div>
            <div className="pricing-card premium">
              <div className="pricing-badge">BEST VALUE</div>
              <h3 className="pricing-name">PRO</h3>
              <div className="pricing-price-container">
                <span className="pricing-price">$9</span>
                <span className="pricing-period">/month</span>
              </div>
              <p className="pricing-annual">or $89/year (save $20)</p>
              <ul className="pricing-features">
                <li>✓ Everything in Free</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Unlimited goals</li>
                <li>✓ Priority support</li>
                <li>✓ PDF reports</li>
                <li>✓ Insurance tracking</li>
              </ul>
              <button className="btn-pricing-premium" onClick={() => navigate('/register')}>Start Free Trial</button>
            </div>
          </div>
          <p className="pricing-note">30-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="section faq">
        <div className="section-content">
          <h2 className="section-emoji">Frequently Asked Questions</h2>
          <div className="section-divider"></div>
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">Is my financial data secure?</h3>
              <p className="faq-answer">Yes. We use bank-level 256-bit encryption and never share your data with third parties.</p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Do I need to connect my bank account?</h3>
              <p className="faq-answer">No! You can manually add all transactions. Bank integration is optional.</p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">What platforms do you support?</h3>
              <p className="faq-answer">We support 100+ gig platforms including Uber, Lyft, DoorDash, Upwork, Fiverr, and more.</p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Can I use this for my taxes?</h3>
              <p className="faq-answer">Yes! Our export features create tax-ready reports for your accountant or self-filing.</p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Is there a mobile app?</h3>
              <p className="faq-answer">Yes! Available on iOS, Android, and web. All sync in real-time.</p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Can I export my data?</h3>
              <p className="faq-answer">Of course! You own your data. Export everything anytime in CSV or PDF format.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="section cta">
        <div className="section-content">
          <h2 className="cta-title">Ready to Take Control?</h2>
          <p className="cta-subtitle">
            Join thousands of gig workers managing their finances smarter.
          </p>
          <button className="btn-cta" onClick={() => navigate('/register')}>Get Started Free</button>
          <p className="cta-signin">Already have an account? <span onClick={() => navigate('/login')} className="link">Sign In</span></p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>GIG ECONOMY</h3>
            <p>Financial Control For Gig Workers</p>
          </div>
          <div className="footer-column">
            <h4>Product</h4>
            <a href="#features" onClick={(e) => { e.preventDefault(); document.querySelector('.features')?.scrollIntoView({ behavior: 'smooth' }); }}>Features</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); document.querySelector('.pricing')?.scrollIntoView({ behavior: 'smooth' }); }}>Pricing</a>
          </div>
          <div className="footer-column">
            <h4>Support</h4>
            <a href="/help" onClick={(e) => { e.preventDefault(); navigate('/help'); }}>Help Center</a>
            <a href="mailto:support@gigeconomyapp.com?subject=Support%20Request">Contact</a>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>Privacy</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>Terms</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 GIG ECONOMY. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
