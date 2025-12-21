import { useState } from 'react'
import { useFinanceStore } from '../store/financeStore'
import Tesseract from 'tesseract.js'
import './DashboardPages.css'

export default function Receipts() {
  const { receipts, addReceipt, deleteReceipt, addExpense } = useFinanceStore()
  const [uploading, setUploading] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [ocrProgress, setOcrProgress] = useState(0)

  // Image preprocessing function to improve OCR accuracy
  const preprocessImage = (imageUri) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // Set canvas size - scale up small images for better OCR
        const scaleFactor = Math.max(1, 2000 / Math.max(img.width, img.height))
        canvas.width = img.width * scaleFactor
        canvas.height = img.height * scaleFactor

        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        // Apply preprocessing: Convert to grayscale and increase contrast
        for (let i = 0; i < data.length; i += 4) {
          // Convert to grayscale
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114

          // Increase contrast (make darks darker, lights lighter)
          let adjusted = gray
          if (gray < 128) {
            adjusted = Math.max(0, gray - 30)  // Darken dark areas
          } else {
            adjusted = Math.min(255, gray + 30)  // Lighten light areas
          }

          // Apply sharpening by enhancing edges
          const sharpen = adjusted * 1.2
          const final = Math.min(255, Math.max(0, sharpen))

          data[i] = final      // R
          data[i + 1] = final  // G
          data[i + 2] = final  // B
          // Alpha stays the same
        }

        // Put the processed data back
        ctx.putImageData(imageData, 0, 0)

        // Convert canvas to data URL
        const processedImage = canvas.toDataURL('image/png')
        console.log('✓ Image preprocessed - Original size:', img.width, 'x', img.height,
                    'Processed size:', canvas.width, 'x', canvas.height)
        resolve(processedImage)
      }

      img.onerror = (error) => {
        console.error('Image preprocessing error:', error)
        reject(error)
      }

      img.src = imageUri
    })
  }

  const extractReceiptData = (text) => {
    console.log('=== OCR TEXT START ===')
    console.log(text)
    console.log('=== OCR TEXT END ===')

    // Clean up text - normalize whitespace
    const cleanText = text.replace(/\s+/g, ' ').trim()

    // Extract total amount - try multiple strategies
    let amount = null

    // Strategy 1: Look for "TOTAL" or similar keywords followed by amount
    const totalPatterns = [
      // TOTAL: $12.34 or TOTAL $12.34 or TOTAL 12.34
      /(?:total|grand\s*total|subtotal|amount\s*due|balance\s*due|payment\s*total|final\s*total)[:\s]*\$?\s*(\d{1,6}[.,]\d{2})/i,
      // Amount Due: $12.34
      /(?:amount|balance|due)[:\s]*\$?\s*(\d{1,6}[.,]\d{2})/i,
      // Line that says just TOTAL then amount on next part
      /total[:\s]*[\r\n\s]*\$?\s*(\d{1,6}[.,]\d{2})/i
    ]

    for (const pattern of totalPatterns) {
      const match = text.match(pattern)
      if (match) {
        amount = match[1].replace(',', '.').replace(/\s/g, '')
        console.log('✓ Found amount with keyword pattern:', amount, 'from:', match[0])
        break
      }
    }

    // Strategy 2: If no TOTAL keyword, find all dollar amounts and pick smartly
    if (!amount) {
      // Match formats: $12.34, $ 12.34, 12.34
      const dollarAmounts = text.match(/\$\s*(\d{1,6}[.,]\d{2})/g)
      const plainAmounts = text.match(/(?<!\d)(\d{1,6}\.\d{2})(?!\d)/g)

      let allAmounts = []

      if (dollarAmounts) {
        allAmounts = dollarAmounts.map(a => parseFloat(a.replace(/[$,\s]/g, '')))
        console.log('Found dollar amounts:', allAmounts)
      } else if (plainAmounts) {
        allAmounts = plainAmounts.map(a => parseFloat(a))
        console.log('Found plain amounts:', allAmounts)
      }

      if (allAmounts.length > 0) {
        // Filter out unrealistic amounts
        const realistic = allAmounts.filter(a => a > 0 && a < 10000)

        if (realistic.length > 0) {
          // Usually the total is the largest amount
          amount = Math.max(...realistic).toFixed(2)
          console.log('✓ Picked largest amount:', amount, 'from:', realistic)
        }
      }
    }

    // Strategy 3: Look for any number with 2 decimal places
    if (!amount) {
      const anyMoney = text.match(/(\d{1,6}\.\d{2})/)
      if (anyMoney) {
        amount = anyMoney[1]
        console.log('✓ Found amount from basic pattern:', amount)
      }
    }

    // Extract store name - intelligent recognition
    const knownStores = [
      'starbucks', 'dunkin', 'mcdonalds', 'burger king', 'wendys', 'taco bell',
      'subway', 'kfc', 'pizza hut', 'dominos', 'chipotle', 'panera',
      'walmart', 'target', 'costco', 'safeway', 'kroger', 'whole foods',
      'trader joes', 'aldi', 'publix', 'food lion', 'giant', 'albertsons',
      'shell', 'exxon', 'chevron', 'bp', 'mobil', 'texaco', '76', 'arco',
      'cvs', 'walgreens', 'rite aid', 'best buy', 'apple store', 'amazon',
      'home depot', 'lowes', 'staples', 'office depot', 'fedex', 'ups',
      'hilton', 'marriott', 'hyatt', 'holiday inn', 'motel 6', 'super 8'
    ]

    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => {
        // Skip empty lines
        if (line.length < 2) return false
        // Skip lines that are just numbers, dates, or symbols
        if (/^[\d\s\-\/:.,#]+$/.test(line)) return false
        // Skip common receipt headers
        if (/^(receipt|invoice|tax invoice|customer copy|merchant copy|tax|date|time|store|location)/i.test(line)) return false
        // Skip lines that are just "Thank you" or similar
        if (/^(thank you|thanks|have a nice day|come again)/i.test(line)) return false
        return true
      })

    let storeName = 'Unknown Store'

    // Strategy 1: Try to find known store names in the text
    const lowerText = text.toLowerCase()
    for (const store of knownStores) {
      if (lowerText.includes(store)) {
        // Found a known store! Try to extract the exact line
        const storeLine = lines.find(line => line.toLowerCase().includes(store))
        if (storeLine) {
          storeName = storeLine
            .replace(/[^\w\s&'-]/g, '')
            .substring(0, 50)
            .trim()
          console.log('✓ Recognized known store:', storeName)
          break
        }
      }
    }

    // Strategy 2: If no known store, look for store-name patterns
    if (storeName === 'Unknown Store' && lines.length > 0) {
      // Look for lines that look like store names (mostly uppercase letters, 3+ chars)
      const candidateLines = lines.filter(line => {
        // Should have mostly letters
        const letterCount = (line.match(/[a-zA-Z]/g) || []).length
        const totalChars = line.replace(/\s/g, '').length
        const letterRatio = totalChars > 0 ? letterCount / totalChars : 0

        // Should be at least 60% letters
        return letterRatio >= 0.6 && line.length >= 3 && line.length <= 50
      })

      if (candidateLines.length > 0) {
        // Take the first candidate, preferring uppercase lines (store names often in caps)
        const uppercaseLines = candidateLines.filter(line => line === line.toUpperCase())
        storeName = (uppercaseLines[0] || candidateLines[0])
          .replace(/[^\w\s&'-]/g, '')
          .substring(0, 50)
          .trim()
        console.log('✓ Extracted store name from pattern:', storeName)
      }
    }

    // Strategy 3: Fallback to first meaningful line
    if (storeName === 'Unknown Store' && lines.length > 0) {
      storeName = lines[0]
        .replace(/[^\w\s&'-]/g, '')
        .substring(0, 50)
        .trim()
      console.log('✓ Using first line as store name:', storeName)
    }

    // Clean up common prefixes/suffixes
    storeName = storeName
      .replace(/^(store|shop|location|branch|#)\s*/i, '')
      .replace(/\s*(inc|llc|ltd|corp|corporation|co)\.?$/i, '')
      .trim()

    console.log('✓ Final store name:', storeName)

    // Extract date - multiple format support
    const datePatterns = [
      // MM/DD/YYYY or MM-DD-YYYY or M/D/YY
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
      // YYYY-MM-DD
      /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
      // Month DD, YYYY (Dec 21, 2025)
      /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4})/i,
      // DD Month YYYY (21 Dec 2025)
      /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4})/i,
      // Month DD (Dec 21) - will use current year
      /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2})/i
    ]

    let date = new Date().toISOString().split('T')[0]
    const currentYear = new Date().getFullYear()

    for (const pattern of datePatterns) {
      const match = text.match(pattern)
      if (match) {
        try {
          let dateStr = match[0]

          // If year is 2-digit, convert to 4-digit
          if (/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2}$/.test(dateStr)) {
            dateStr = dateStr.replace(/(\d{2})$/, '20$1')
          }

          const parsedDate = new Date(dateStr)

          // Validate the date
          if (!isNaN(parsedDate.getTime())) {
            const year = parsedDate.getFullYear()

            // Check if year is reasonable (between 2000 and current year)
            if (year >= 2000 && year <= currentYear) {
              date = parsedDate.toISOString().split('T')[0]
              console.log('✓ Extracted date:', date, 'from:', match[0])
              break
            }
          }
        } catch (e) {
          console.log('Date parsing error:', e)
        }
      }
    }

    const result = {
      storeName,
      amount: amount || '0.00',
      date
    }

    console.log('=== FINAL EXTRACTED DATA ===')
    console.log(result)
    console.log('===========================')

    return result
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
    console.log('=== UPLOAD STARTED ===')

    const file = e.target.files[0]
    console.log('File selected:', file)

    if (!file) {
      console.log('No file selected')
      return
    }

    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: new Date(file.lastModified)
    })

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type)
      alert('Please upload an image file (JPG, PNG, etc.)')
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.error('File too large:', file.size)
      alert('Image too large. Please upload an image smaller than 10MB.')
      return
    }

    console.log('Starting upload process...')
    setUploading(true)
    setOcrProgress(0)

    const reader = new FileReader()

    reader.onload = async (event) => {
      console.log('File loaded, starting OCR...')

      try {
        const imageUri = event.target.result
        console.log('Image URI length:', imageUri.length)

        console.log('Preprocessing image for better OCR accuracy...')
        setOcrProgress(5)

        // Preprocess image to improve OCR accuracy
        const processedImage = await preprocessImage(imageUri)

        console.log('Initializing Tesseract with optimized settings...')
        setOcrProgress(10)

        // Perform OCR with optimized configuration
        const result = await Tesseract.recognize(
          processedImage,  // Use preprocessed image
          'eng',
          {
            logger: (m) => {
              if (m.status === 'recognizing text') {
                const progress = 10 + Math.round(m.progress * 80)  // 10-90%
                console.log(`OCR Progress: ${progress}%`)
                setOcrProgress(progress)
              } else {
                console.log('OCR Status:', m.status)
              }
            },
            // Tesseract configuration for better receipt reading
            tessedit_pageseg_mode: Tesseract.PSM.AUTO,  // Automatic page segmentation
            tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$.,/-:() &\'',  // Common receipt characters
          }
        )

        setOcrProgress(95)

        console.log('OCR Complete!')
        const ocrText = result.data.text
        console.log('Text length:', ocrText.length)

        if (!ocrText || ocrText.trim().length === 0) {
          throw new Error('No text found in image. Please try a clearer photo.')
        }

        // Extract receipt data from OCR text
        const extractedData = extractReceiptData(ocrText)
        console.log('Extracted data:', extractedData)

        // Validate extracted amount
        let finalAmount = extractedData.amount
        const amountValue = parseFloat(extractedData.amount)

        if (isNaN(amountValue) || amountValue <= 0) {
          console.warn('Amount not detected, prompting user...')
          const userAmount = prompt(
            'Could not detect amount automatically. Please enter the receipt amount:',
            '0.00'
          )
          if (userAmount) {
            finalAmount = parseFloat(userAmount).toFixed(2)
            extractedData.amount = finalAmount
            console.log('User entered amount:', finalAmount)
          } else {
            throw new Error('Receipt amount is required')
          }
        }

        const category = categorizeReceipt(extractedData.storeName, ocrText)
        console.log('Categorized as:', category)

        const expenseData = {
          amount: parseFloat(extractedData.amount),
          category,
          date: extractedData.date,
          paymentMethod: 'Credit Card'
        }

        const receiptData = {
          ...extractedData,
          imageUri,
          ocrText,
          category
        }

        console.log('Saving expense:', expenseData)
        addExpense(expenseData)

        console.log('Saving receipt:', { ...receiptData, imageUri: 'base64...' })
        addReceipt(receiptData)

        console.log('=== SAVE COMPLETE ===')

        setOcrProgress(100)

        // Show success message
        setTimeout(() => {
          alert(`✓ Receipt scanned successfully!\n\nStore: ${extractedData.storeName}\nAmount: $${extractedData.amount}\nCategory: ${category}\n\nSaved to expenses!`)

          setUploading(false)
          setOcrProgress(0)
        }, 500)

        // Reset file input
        if (e.target) {
          e.target.value = ''
        }

        console.log('=== UPLOAD FINISHED ===')
      } catch (error) {
        console.error('=== OCR ERROR ===')
        console.error('Error details:', error)
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)

        setUploading(false)
        setOcrProgress(0)

        alert(`Error processing receipt: ${error.message || 'Unknown error'}.\n\nPlease try again with a clearer photo.\n\nCheck browser console (F12) for details.`)
      }
    }

    reader.onerror = (error) => {
      console.error('=== FILE READER ERROR ===')
      console.error('Reader error:', error)

      setUploading(false)
      setOcrProgress(0)

      alert('Failed to read image file. Please try again.')
    }

    console.log('Reading file as Data URL...')
    reader.readAsDataURL(file)
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
