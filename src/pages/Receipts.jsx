import { useState } from 'react'
import { useFinanceStore } from '../store/financeStore'
import Tesseract from 'tesseract.js'
import './DashboardPages.css'

export default function Receipts() {
  const { receipts, addReceipt, deleteReceipt, addExpense } = useFinanceStore()
  const [uploading, setUploading] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [ocrProgress, setOcrProgress] = useState(0)

  const extractReceiptData = (text) => {
    // Extract total amount - look for patterns like "TOTAL: $XX.XX", "Total $XX.XX", etc.
    const amountPatterns = [
      /total[:\s]*\$?(\d+\.?\d{0,2})/i,
      /amount[:\s]*\$?(\d+\.?\d{0,2})/i,
      /balance[:\s]*\$?(\d+\.?\d{0,2})/i,
      /\$(\d+\.\d{2})/g
    ]

    let amount = null
    for (const pattern of amountPatterns) {
      const match = text.match(pattern)
      if (match) {
        const numbers = text.match(/\$?(\d+\.\d{2})/g)
        if (numbers && numbers.length > 0) {
          // Usually the total is one of the larger amounts, often the last one
          amount = numbers[numbers.length - 1].replace('$', '')
        }
        break
      }
    }

    // Extract store name - usually at the top of the receipt
    const lines = text.split('\n').filter(line => line.trim())
    let storeName = 'Unknown Store'
    if (lines.length > 0) {
      storeName = lines[0].trim()
    }

    // Extract date - look for common date patterns
    const datePatterns = [
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
      /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}/i
    ]

    let date = new Date().toISOString().split('T')[0]
    for (const pattern of datePatterns) {
      const match = text.match(pattern)
      if (match) {
        try {
          const parsedDate = new Date(match[0])
          if (!isNaN(parsedDate.getTime())) {
            date = parsedDate.toISOString().split('T')[0]
          }
        } catch (e) {
          // Keep default date if parsing fails
        }
        break
      }
    }

    return {
      storeName,
      amount: amount || '0.00',
      date
    }
  }

  const categorizeReceipt = (storeName, ocrText) => {
    const name = storeName.toLowerCase()
    const fullText = ocrText.toLowerCase()

    // Transportation & Fuel
    if (name.includes('shell') || name.includes('exxon') || name.includes('chevron') ||
        name.includes('bp') || name.includes('mobil') || name.includes('texaco') ||
        name.includes('arco') || name.includes('valero') || name.includes('citgo') ||
        fullText.includes('gasoline') || fullText.includes('fuel') || fullText.includes('gallon')) {
      return 'Gas & Fuel'
    }

    // Auto-related
    if (name.includes('auto') || name.includes('jiffy') || name.includes('midas') ||
        name.includes('pep boys') || fullText.includes('oil change') ||
        fullText.includes('tire') || fullText.includes('brake') || fullText.includes('repair')) {
      return 'Car Maintenance'
    }

    // Parking & Tolls
    if (fullText.includes('parking') || fullText.includes('toll') || name.includes('park')) {
      return 'Parking'
    }

    // Groceries
    if (name.includes('walmart') || name.includes('target') || name.includes('costco') ||
        name.includes('safeway') || name.includes('kroger') || name.includes('publix') ||
        name.includes('whole foods') || name.includes('trader joe') || name.includes('aldi') ||
        name.includes('grocery') || fullText.includes('produce') || fullText.includes('dairy')) {
      return 'Groceries'
    }

    // Restaurants & Fast Food
    if (name.includes('mcdonald') || name.includes('burger king') || name.includes('wendy') ||
        name.includes('taco bell') || name.includes('kfc') || name.includes('subway') ||
        name.includes('pizza') || name.includes('domino') || name.includes('restaurant') ||
        name.includes('grill') || name.includes('diner') || name.includes('bistro') ||
        fullText.includes('server') || fullText.includes('tip') || fullText.includes('dine')) {
      return 'Restaurants'
    }

    // Coffee & Cafes
    if (name.includes('starbucks') || name.includes('dunkin') || name.includes('coffee') ||
        name.includes('cafe') || name.includes('espresso') || fullText.includes('latte') ||
        fullText.includes('cappuccino') || fullText.includes('mocha')) {
      return 'Coffee & Snacks'
    }

    // Office Supplies
    if (name.includes('staples') || name.includes('office depot') || name.includes('officemax') ||
        fullText.includes('paper') || fullText.includes('printer') || fullText.includes('ink') ||
        fullText.includes('pen') || fullText.includes('folder')) {
      return 'Office Supplies'
    }

    // Electronics & Equipment
    if (name.includes('best buy') || name.includes('apple') || name.includes('microsoft') ||
        name.includes('amazon') || fullText.includes('laptop') || fullText.includes('computer') ||
        fullText.includes('phone') || fullText.includes('tablet') || fullText.includes('electronics')) {
      return 'Equipment'
    }

    // Internet & Phone
    if (name.includes('verizon') || name.includes('at&t') || name.includes('t-mobile') ||
        name.includes('comcast') || name.includes('spectrum') || fullText.includes('wireless') ||
        fullText.includes('internet') || fullText.includes('phone plan')) {
      return 'Internet & Phone'
    }

    // Hotels & Travel
    if (name.includes('hotel') || name.includes('marriott') || name.includes('hilton') ||
        name.includes('airbnb') || name.includes('airline') || fullText.includes('accommodation') ||
        fullText.includes('flight') || fullText.includes('airfare')) {
      return 'Hotels'
    }

    // Utilities
    if (fullText.includes('electric') || fullText.includes('utility') || fullText.includes('water bill') ||
        fullText.includes('gas bill') || fullText.includes('power')) {
      return 'Electricity'
    }

    // Health & Medical
    if (name.includes('pharmacy') || name.includes('cvs') || name.includes('walgreens') ||
        name.includes('hospital') || name.includes('clinic') || fullText.includes('prescription') ||
        fullText.includes('medication') || fullText.includes('medical')) {
      return 'Medical Expenses'
    }

    // Check for general categories based on common items
    if (fullText.includes('bread') || fullText.includes('milk') || fullText.includes('eggs') ||
        fullText.includes('fruit') || fullText.includes('vegetable') || fullText.includes('meat')) {
      return 'Groceries'
    }

    if (fullText.includes('dinner') || fullText.includes('lunch') || fullText.includes('breakfast') ||
        fullText.includes('appetizer') || fullText.includes('entree') || fullText.includes('dessert')) {
      return 'Restaurants'
    }

    // Default to a general category based on common patterns
    if (fullText.includes('service') || fullText.includes('fee')) {
      return 'Fees'
    }

    // If still no match, try to make an educated guess
    return 'Miscellaneous'
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setOcrProgress(0)

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const imageUri = event.target.result

        // Perform OCR on the image
        const result = await Tesseract.recognize(
          imageUri,
          'eng',
          {
            logger: (m) => {
              if (m.status === 'recognizing text') {
                setOcrProgress(Math.round(m.progress * 100))
              }
            }
          }
        )

        const ocrText = result.data.text
        console.log('OCR Text:', ocrText)

        // Extract receipt data from OCR text
        const extractedData = extractReceiptData(ocrText)
        const category = categorizeReceipt(extractedData.storeName, ocrText)

        // Automatically save as expense
        addExpense({
          amount: parseFloat(extractedData.amount),
          category,
          date: extractedData.date,
          paymentMethod: 'Credit Card'
        })

        // Also add to receipts for review
        addReceipt({
          ...extractedData,
          imageUri,
          ocrText,
          category
        })

        alert(`Receipt scanned! Saved as "${category}" expense with amount $${extractedData.amount}`)

        setUploading(false)
        setOcrProgress(0)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('OCR Error:', error)
      setUploading(false)
      setOcrProgress(0)
      alert('Failed to process receipt. Please try again.')
    }
  }

  return (
    <div className="dashboard-page">
      <h1 className="page-title">📸 Receipt Scanner</h1>

      <div className="form-container" style={{ marginBottom: '32px' }}>
        <div style={{ textAlign: 'center' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="receipt-upload"
            disabled={uploading}
          />
          <label
            htmlFor="receipt-upload"
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              background: '#71717a',
              color: '#ffffff',
              borderRadius: '12px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              opacity: uploading ? 0.6 : 1
            }}
          >
            {uploading ? `📸 Processing ${ocrProgress}%...` : '📷 Upload Receipt'}
          </label>
          <p style={{ color: '#9ca3af', marginTop: '12px', fontSize: '14px' }}>
            💡 Take a clear photo of your receipt. AI will automatically read and save it as an expense!
          </p>
          {uploading && (
            <div style={{ marginTop: '16px' }}>
              <div style={{
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto',
                height: '8px',
                background: '#27272a',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${ocrProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <p style={{ color: '#71717a', fontSize: '13px', marginTop: '8px' }}>
                Reading receipt text...
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">📋 Scanned Receipts</h2>
        {receipts.length > 0 ? (
          <div className="data-list">
            {receipts.map((receipt) => (
              <div key={receipt.id} className="data-item">
                <div className="item-header">
                  <div>
                    <div className="item-title">🧾 {receipt.storeName}</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#f87171', marginTop: '8px' }}>
                      ${parseFloat(receipt.amount).toFixed(2)}
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      className="btn-edit"
                      onClick={() => setSelectedReceipt(selectedReceipt?.id === receipt.id ? null : receipt)}
                    >
                      {selectedReceipt?.id === receipt.id ? 'Hide' : 'View'}
                    </button>
                    <button className="btn-delete" onClick={() => deleteReceipt(receipt.id)}>Delete</button>
                  </div>
                </div>
                <div className="item-details">
                  <div className="item-detail"><strong>Date:</strong> {new Date(receipt.date).toLocaleDateString()}</div>
                  {receipt.category && (
                    <div className="item-detail"><strong>Category:</strong> {receipt.category}</div>
                  )}
                  {receipt.items && (
                    <div className="item-detail">
                      <strong>Items:</strong>{' '}
                      {receipt.items.map(item => `${item.name} ($${item.price})`).join(', ')}
                    </div>
                  )}
                  <div className="item-detail" style={{ marginTop: '8px', padding: '8px', background: '#09090b', borderRadius: '6px' }}>
                    <strong style={{ color: '#10b981' }}>✓ Auto-saved to Expenses</strong>
                  </div>
                </div>
                {selectedReceipt?.id === receipt.id && receipt.imageUri && (
                  <div style={{ marginTop: '16px' }}>
                    <img
                      src={receipt.imageUri}
                      alt="Receipt"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '400px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No receipts scanned yet. Upload a receipt to get started!</p>
        )}
      </div>
    </div>
  )
}
