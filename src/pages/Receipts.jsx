import { useState } from 'react'
import { useFinanceStore } from '../store/financeStore'
import './DashboardPages.css'

export default function Receipts() {
  const { receipts, addReceipt, deleteReceipt, addExpense } = useFinanceStore()
  const [uploading, setUploading] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)

    // Simulate OCR processing
    setTimeout(() => {
      const reader = new FileReader()
      reader.onload = (event) => {
        // Simulated OCR data extraction
        const mockOCRData = {
          storeName: ['Walmart', 'Target', 'Shell Gas', 'Starbucks', 'Office Depot'][Math.floor(Math.random() * 5)],
          amount: (Math.random() * 100 + 10).toFixed(2),
          date: new Date().toISOString().split('T')[0],
          items: [
            { name: 'Item 1', price: (Math.random() * 20).toFixed(2) },
            { name: 'Item 2', price: (Math.random() * 30).toFixed(2) },
            { name: 'Item 3', price: (Math.random() * 15).toFixed(2) }
          ],
          imageUri: event.target.result
        }

        addReceipt(mockOCRData)
        setUploading(false)
      }
      reader.readAsDataURL(file)
    }, 2000)
  }

  const handleSaveAsExpense = (receipt) => {
    const category = receipt.storeName.includes('Gas') || receipt.storeName.includes('Shell') ? 'Gas' :
                     receipt.storeName.includes('Office') ? 'Office Supplies' :
                     receipt.storeName.includes('Starbucks') ? 'Food' : 'Other'

    addExpense({
      amount: parseFloat(receipt.amount),
      category,
      description: `${receipt.storeName} - Scanned from receipt`,
      date: receipt.date,
      paymentMethod: 'Credit Card'
    })

    deleteReceipt(receipt.id)
    alert('Receipt saved as expense!')
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
            {uploading ? '📸 Scanning...' : '📷 Upload Receipt'}
          </label>
          <p style={{ color: '#9ca3af', marginTop: '12px', fontSize: '14px' }}>
            💡 Take a clear photo of your receipt. AI will automatically extract the details!
          </p>
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
                  {receipt.items && (
                    <div className="item-detail">
                      <strong>Items:</strong>{' '}
                      {receipt.items.map(item => `${item.name} ($${item.price})`).join(', ')}
                    </div>
                  )}
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
                <button
                  className="btn-submit"
                  onClick={() => handleSaveAsExpense(receipt)}
                  style={{ marginTop: '16px', width: '100%' }}
                >
                  💾 Save as Expense
                </button>
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
