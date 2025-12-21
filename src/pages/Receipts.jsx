import { useState } from 'react'
import { useFinanceStore } from '../store/financeStore'
import Tesseract from 'tesseract.js'
import './DashboardPages.css'

export default function Receipts() {
  const { receipts, addReceipt, deleteReceipt, addExpense } = useFinanceStore()
  const [uploading, setUploading] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [ocrProgress, setOcrProgress] = useState(0)

  // Optimized image preprocessing for receipt OCR with error handling
  const preprocessImage = (imageUri) => {
    return new Promise((resolve, reject) => {
      const img = new Image()

      img.onload = () => {
        try {
          console.log('🖼️  Preprocessing image for OCR...')
          console.log('   Original:', img.width, 'x', img.height)

          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          // Scale to 2400px (good balance of quality and performance)
          const maxDimension = 2400
          const scale = Math.max(1, maxDimension / Math.max(img.width, img.height))
          canvas.width = Math.floor(img.width * scale)
          canvas.height = Math.floor(img.height * scale)

          console.log('   Scaled to:', canvas.width, 'x', canvas.height)

          // Draw with high quality
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          // Get pixel data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          const len = data.length

          console.log('   Converting to high-contrast black & white...')

          // Step 1: Convert to grayscale
          for (let i = 0; i < len; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
            data[i] = data[i + 1] = data[i + 2] = avg
          }

          // Step 2: Calculate average brightness for threshold
          let sum = 0
          for (let i = 0; i < len; i += 4) {
            sum += data[i]
          }
          const avgBrightness = sum / (len / 4)
          const threshold = avgBrightness * 0.75  // Adaptive threshold

          console.log('   Brightness threshold:', threshold.toFixed(0))

          // Step 3: Apply threshold (convert to pure black/white)
          for (let i = 0; i < len; i += 4) {
            const value = data[i] > threshold ? 255 : 0
            data[i] = data[i + 1] = data[i + 2] = value
          }

          // Step 4: Simple denoising - remove isolated pixels
          const width = canvas.width
          const height = canvas.height
          const cleaned = new Uint8ClampedArray(data)

          for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
              const idx = (y * width + x) * 4

              if (data[idx] === 0) {  // Black pixel
                // Count black neighbors
                let blackCount = 0
                for (let dy = -1; dy <= 1; dy++) {
                  for (let dx = -1; dx <= 1; dx++) {
                    const nIdx = ((y + dy) * width + (x + dx)) * 4
                    if (data[nIdx] === 0) blackCount++
                  }
                }
                // Remove if too few black neighbors (likely noise)
                if (blackCount < 3) {
                  cleaned[idx] = cleaned[idx + 1] = cleaned[idx + 2] = 255
                }
              }
            }
          }

          // Apply cleaned data
          for (let i = 0; i < len; i++) {
            data[i] = cleaned[i]
          }

          // Step 5: Slight sharpening for text clarity
          console.log('   Sharpening text...')
          const sharpened = new Uint8ClampedArray(data)

          for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
              const idx = (y * width + x) * 4

              // Simple sharpening kernel
              const center = data[idx] * 5
              const edges =
                data[((y-1) * width + x) * 4] +      // top
                data[((y+1) * width + x) * 4] +      // bottom
                data[(y * width + (x-1)) * 4] +      // left
                data[(y * width + (x+1)) * 4]        // right

              const value = Math.min(255, Math.max(0, center - edges))
              sharpened[idx] = sharpened[idx + 1] = sharpened[idx + 2] = value
            }
          }

          // Apply sharpened data
          for (let i = 0; i < len; i++) {
            data[i] = sharpened[i]
          }

          ctx.putImageData(imageData, 0, 0)

          const processedImage = canvas.toDataURL('image/png')
          console.log('✅ Image preprocessing complete!')
          resolve(processedImage)

        } catch (error) {
          console.error('❌ Preprocessing error:', error)
          console.log('⚠️  Falling back to original image')
          resolve(imageUri)  // Fallback to original
        }
      }

      img.onerror = (error) => {
        console.error('❌ Image load error:', error)
        reject(new Error('Failed to load image'))
      }

      img.crossOrigin = 'anonymous'  // Enable CORS if needed
      img.src = imageUri
    })
  }

  const extractReceiptData = (text) => {
    console.log('=== OCR TEXT START ===')
    console.log(text)
    console.log('=== OCR TEXT END ===')

    // Clean up text - normalize whitespace but keep line breaks for context
    const cleanText = text.replace(/[ \t]+/g, ' ').trim()
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)

    // Extract total amount - ENHANCED with comprehensive pattern matching
    let amount = null
    let amountConfidence = 0  // Track how confident we are (higher = better)

    console.log('📊 ANALYZING RECEIPT FOR TOTAL AMOUNT...')
    console.log('Number of lines:', lines.length)

    // Strategy 1A: Look for explicit TOTAL keywords with various formats (HIGHEST PRIORITY)
    const totalKeywordPatterns = [
      // Most explicit patterns first
      { pattern: /(?:grand[\s\-_]*total|total[\s\-_]*amount|final[\s\-_]*total|amount[\s\-_]*due|balance[\s\-_]*due|total[\s\-_]*price)[:\s=]*\$?\s*(\d{1,6}[.,]\d{2})/gi, confidence: 100, label: 'Grand/Final Total' },
      { pattern: /(?:total|ttl)[\s]*[:\-=][\s]*\$?\s*(\d{1,6}[.,]\d{2})/gi, confidence: 95, label: 'Total with separator' },
      { pattern: /\btotal\b[\s]*\$?\s*(\d{1,6}[.,]\d{2})/gi, confidence: 90, label: 'Simple Total' },
      { pattern: /(?:sub[\s]*total|subtotal)[\s:=]*\$?\s*(\d{1,6}[.,]\d{2})/gi, confidence: 85, label: 'Subtotal' },
      // Payment/charge related
      { pattern: /(?:amount[\s]*charged|payment[\s]*total|total[\s]*charge)[\s:=]*\$?\s*(\d{1,6}[.,]\d{2})/gi, confidence: 95, label: 'Payment Total' },
      // Common receipt variations
      { pattern: /(?:net[\s]*total|gross[\s]*total)[\s:=]*\$?\s*(\d{1,6}[.,]\d{2})/gi, confidence: 92, label: 'Net/Gross Total' },
    ]

    for (const { pattern, confidence, label } of totalKeywordPatterns) {
      const matches = [...text.matchAll(pattern)]
      if (matches.length > 0) {
        console.log(`🔍 Found ${matches.length} match(es) for "${label}"`)

        // If multiple totals, prefer the last one (usually GRAND TOTAL or final amount)
        const match = matches[matches.length - 1]
        const extractedAmount = match[1].replace(/,/g, '').replace(/\s/g, '')
        const numValue = parseFloat(extractedAmount)

        if (numValue > 0 && numValue < 100000) {
          if (confidence > amountConfidence) {
            amount = extractedAmount
            amountConfidence = confidence
            console.log(`✅ BEST MATCH: ${label} with ${confidence}% confidence: $${amount}`)
            console.log(`   Full match: "${match[0]}"`)
          }
        }
      }
    }

    // Strategy 1B: Look for TOTAL keyword on one line and amount on next line (common format)
    if (!amount || amountConfidence < 85) {
      console.log('🔍 Checking for multi-line TOTAL format...')
      for (let i = 0; i < lines.length - 1; i++) {
        // Check if line contains "total" but no number
        if (/\b(?:total|ttl|grand\s*total|final\s*total)\b/i.test(lines[i]) && !/\d{1,6}[.,]\d{2}/.test(lines[i])) {
          // Check next line for amount
          const nextLine = lines[i + 1]
          const amountMatch = nextLine.match(/\$?\s*(\d{1,6}[.,]\d{2})/)

          if (amountMatch) {
            const extractedAmount = amountMatch[1].replace(/,/g, '').replace(/\s/g, '')
            const numValue = parseFloat(extractedAmount)

            if (numValue > 0 && numValue < 100000 && 85 > amountConfidence) {
              amount = extractedAmount
              amountConfidence = 85
              console.log(`✅ Found TOTAL on line: "${lines[i]}"`)
              console.log(`   Amount on next line: $${amount} (85% confidence)`)
              break
            }
          }
        }
      }
    }

    // Strategy 2: Search in the bottom 40% of receipt (totals are at the end)
    if (!amount || amountConfidence < 75) {
      console.log('🔍 Searching bottom portion of receipt...')
      const bottomPortion = lines.slice(-Math.ceil(lines.length * 0.4))
      const bottomText = bottomPortion.join('\n')

      // Look for any total-like keyword in bottom
      const bottomTotalMatch = bottomText.match(/(?:total|balance|amount\s*due)[\s:=]*\$?\s*(\d{1,6}[.,]\d{2})/i)

      if (bottomTotalMatch) {
        const extractedAmount = bottomTotalMatch[1].replace(/,/g, '').replace(/\s/g, '')
        const numValue = parseFloat(extractedAmount)

        if (numValue > 0 && numValue < 100000 && 75 > amountConfidence) {
          amount = extractedAmount
          amountConfidence = 75
          console.log(`✅ Found total in bottom section: $${amount} (75% confidence)`)
          console.log(`   From: "${bottomTotalMatch[0]}"`)
        }
      }
    }

    // Strategy 3: Look at amounts near bottom - pick largest (totals are usually biggest)
    if (!amount || amountConfidence < 60) {
      console.log('🔍 Analyzing amounts in bottom 40%...')
      const bottomPortion = lines.slice(-Math.ceil(lines.length * 0.4))
      const bottomText = bottomPortion.join('\n')

      const amountMatches = [...bottomText.matchAll(/\$?\s*(\d{1,6}[.,]\d{2})/g)]

      if (amountMatches.length > 0) {
        const amounts = amountMatches
          .map(m => parseFloat(m[1].replace(/,/g, '').replace(/\s/g, '')))
          .filter(a => a > 0 && a < 100000)

        if (amounts.length > 0) {
          const maxAmount = Math.max(...amounts)
          if (60 > amountConfidence) {
            amount = maxAmount.toFixed(2)
            amountConfidence = 60
            console.log(`✅ Largest amount in bottom section: $${amount} (60% confidence)`)
            console.log(`   All amounts found: ${amounts.map(a => '$' + a.toFixed(2)).join(', ')}`)
          }
        }
      }
    }

    // Strategy 4: Last resort - pick the largest amount from entire receipt
    if (!amount || amountConfidence < 40) {
      console.log('🔍 Fallback: Finding largest amount in entire receipt...')
      const allAmounts = [...text.matchAll(/\$?\s*(\d{1,6}[.,]\d{2})/g)]
        .map(m => parseFloat(m[1].replace(/,/g, '').replace(/\s/g, '')))
        .filter(a => a > 0 && a < 100000)

      if (allAmounts.length > 0) {
        allAmounts.sort((a, b) => b - a)
        const maxAmount = allAmounts[0]

        if (40 > amountConfidence) {
          amount = maxAmount.toFixed(2)
          amountConfidence = 40
          console.log(`⚠️  Fallback - largest amount: $${amount} (40% confidence)`)
          console.log(`   Top 5 amounts: ${allAmounts.slice(0, 5).map(a => '$' + a.toFixed(2)).join(', ')}`)
        }
      }
    }

    // Final fallback - any decimal number
    if (!amount) {
      console.log('🔍 Final fallback - looking for any decimal number...')
      const anyDecimal = text.match(/(\d{1,6}\.\d{2})/)
      if (anyDecimal) {
        amount = anyDecimal[1]
        amountConfidence = 20
        console.log(`⚠️  Last resort - any decimal: $${amount} (20% confidence)`)
      }
    }

    // Ultra fallback - numbers without decimals (format as dollars.cents)
    if (!amount) {
      console.log('🔍 Ultra fallback - looking for numbers without decimals...')
      // Find numbers with 3-6 digits (e.g., "1234" could be $12.34)
      const wholeNumbers = [...text.matchAll(/\b(\d{3,6})\b/g)]
        .map(m => parseInt(m[1]))
        .filter(n => n > 100 && n < 100000)  // Between $1.00 and $1000.00

      if (wholeNumbers.length > 0) {
        // Take the largest, assume last 2 digits are cents
        const largest = Math.max(...wholeNumbers)
        amount = (largest / 100).toFixed(2)
        amountConfidence = 15
        console.log(`⚠️  Ultra fallback - number without decimal: ${largest} → $${amount} (15% confidence)`)
      }
    }

    // Absolute last resort - just take any number with 1 decimal
    if (!amount) {
      console.log('🔍 Absolute fallback - any number with 1 decimal...')
      const singleDecimal = text.match(/(\d{1,6}\.\d{1})/)
      if (singleDecimal) {
        amount = parseFloat(singleDecimal[1]).toFixed(2)
        amountConfidence = 10
        console.log(`⚠️  Absolute fallback - single decimal: $${amount} (10% confidence)`)
      }
    }

    console.log(`\n💰 FINAL AMOUNT DETECTED: $${amount || '0.00'} (${amountConfidence}% confidence)\n`)

    // Extract store name - IMPROVED intelligent recognition with better accuracy
    const knownStores = [
      // Coffee & Fast Food
      { name: 'starbucks', variations: ['starbucks', 'sbux'] },
      { name: 'dunkin', variations: ['dunkin', 'dunkin donuts', 'dunkin\''] },
      { name: 'mcdonalds', variations: ['mcdonalds', 'mcdonald\'s', 'mickey d'] },
      { name: 'burger king', variations: ['burger king', 'bk'] },
      { name: 'wendys', variations: ['wendys', 'wendy\'s'] },
      { name: 'taco bell', variations: ['taco bell', 'tacobell'] },
      { name: 'subway', variations: ['subway'] },
      { name: 'kfc', variations: ['kfc', 'kentucky fried chicken'] },
      { name: 'pizza hut', variations: ['pizza hut', 'pizzahut'] },
      { name: 'dominos', variations: ['dominos', 'domino\'s'] },
      { name: 'chipotle', variations: ['chipotle'] },
      { name: 'panera', variations: ['panera', 'panera bread'] },
      // Grocery Stores
      { name: 'walmart', variations: ['walmart', 'wal-mart', 'wal mart'] },
      { name: 'target', variations: ['target'] },
      { name: 'costco', variations: ['costco'] },
      { name: 'safeway', variations: ['safeway'] },
      { name: 'kroger', variations: ['kroger'] },
      { name: 'whole foods', variations: ['whole foods', 'wholefoods'] },
      { name: 'trader joes', variations: ['trader joes', 'trader joe\'s'] },
      { name: 'aldi', variations: ['aldi'] },
      { name: 'publix', variations: ['publix'] },
      // Gas Stations
      { name: 'shell', variations: ['shell'] },
      { name: 'exxon', variations: ['exxon', 'exxonmobil'] },
      { name: 'chevron', variations: ['chevron'] },
      { name: 'bp', variations: ['bp', 'british petroleum'] },
      { name: 'mobil', variations: ['mobil'] },
      { name: 'texaco', variations: ['texaco'] },
      { name: '76', variations: ['76', 'union 76'] },
      { name: 'arco', variations: ['arco'] },
      // Pharmacies & Retail
      { name: 'cvs', variations: ['cvs', 'cvs pharmacy'] },
      { name: 'walgreens', variations: ['walgreens'] },
      { name: 'rite aid', variations: ['rite aid', 'riteaid'] },
      { name: 'best buy', variations: ['best buy', 'bestbuy'] },
      { name: 'apple store', variations: ['apple', 'apple store'] },
      { name: 'amazon', variations: ['amazon'] },
      { name: 'home depot', variations: ['home depot', 'homedepot'] },
      { name: 'lowes', variations: ['lowes', 'lowe\'s'] },
      // Hotels
      { name: 'hilton', variations: ['hilton'] },
      { name: 'marriott', variations: ['marriott'] },
      { name: 'hyatt', variations: ['hyatt'] }
    ]

    // Filter lines to get candidates for store names
    const filteredLines = lines.filter(line => {
      // Skip empty lines
      if (line.length < 2) return false
      // Skip lines that are just numbers, dates, or symbols
      if (/^[\d\s\-\/:.,#]+$/.test(line)) return false
      // Skip common receipt headers/footers
      if (/^(receipt|invoice|tax invoice|customer copy|merchant copy|tax|date|time|store|location|phone|fax|email|website|thank you|thanks|have a nice day|come again|served by|cashier|server)/i.test(line)) return false
      return true
    })

    let storeName = 'Unknown Store'
    let storeConfidence = 0

    // Strategy 1: Look for known store names (HIGHEST PRIORITY)
    const lowerText = text.toLowerCase()
    for (const store of knownStores) {
      for (const variation of store.variations) {
        if (lowerText.includes(variation)) {
          // Found a known store! Try to extract the most complete version from receipt
          const storeLine = filteredLines.find(line =>
            line.toLowerCase().includes(variation)
          )

          if (storeLine) {
            // Clean and capitalize properly
            let cleanedName = storeLine
              .replace(/[^\w\s&'-]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .substring(0, 50)

            // Convert to title case for better readability
            cleanedName = cleanedName
              .toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')

            storeName = cleanedName
            storeConfidence = 100
            console.log(`✓ Recognized known store with 100% confidence: "${storeName}" (matched: ${variation})`)
            break
          }
        }
      }
      if (storeConfidence === 100) break
    }

    // Strategy 2: Look for store name in first 5 lines (stores usually print name at top)
    if (storeConfidence < 80 && filteredLines.length > 0) {
      const topLines = filteredLines.slice(0, 5)

      for (const line of topLines) {
        // Look for lines that look like store names:
        // - Mostly letters (at least 60%)
        // - 3-50 characters
        // - Preferably uppercase or title case
        const letterCount = (line.match(/[a-zA-Z]/g) || []).length
        const totalChars = line.replace(/\s/g, '').length
        const letterRatio = totalChars > 0 ? letterCount / totalChars : 0

        if (letterRatio >= 0.6 && line.length >= 3 && line.length <= 50) {
          // Check if it's in ALL CAPS (common for store names)
          const isAllCaps = line === line.toUpperCase() && /[A-Z]/.test(line)

          let cleanedName = line
            .replace(/[^\w\s&'-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()

          // Convert to title case for readability
          cleanedName = cleanedName
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')

          const confidence = isAllCaps ? 85 : 75

          if (confidence > storeConfidence) {
            storeName = cleanedName
            storeConfidence = confidence
            console.log(`✓ Extracted store name from top of receipt with ${confidence}% confidence: "${storeName}"`)
          }

          if (isAllCaps) break  // If we found an all-caps name, it's likely the store name
        }
      }
    }

    // Strategy 3: Fallback - use first meaningful line
    if (storeConfidence < 50 && filteredLines.length > 0) {
      let cleanedName = filteredLines[0]
        .replace(/[^\w\s&'-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 50)

      // Convert to title case
      cleanedName = cleanedName
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      storeName = cleanedName
      storeConfidence = 40
      console.log(`✓ Using first line as store name with 40% confidence: "${storeName}"`)
    }

    // Clean up common business suffixes and prefixes
    storeName = storeName
      .replace(/^(store|shop|location|branch|#)\s+/i, '')
      .replace(/\s+(inc|llc|ltd|corp|corporation|co|store|location|branch)\.?$/i, '')
      .replace(/\s+/g, ' ')
      .trim()

    // Ensure we have something
    if (!storeName || storeName.length < 2) {
      storeName = 'Unknown Store'
      storeConfidence = 0
    }

    console.log(`✓ FINAL STORE NAME: "${storeName}" (Confidence: ${storeConfidence}%)`)

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

        console.log('🔍 Starting OCR text recognition...')
        setOcrProgress(10)

        // Perform OCR with optimized settings
        const result = await Tesseract.recognize(
          processedImage,
          'eng',
          {
            logger: (m) => {
              if (m.status === 'recognizing text') {
                const progress = 10 + Math.round(m.progress * 80)  // 10-90%
                setOcrProgress(progress)
                if (progress % 20 === 0) {
                  console.log(`   OCR: ${progress}%`)
                }
              }
            }
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
          console.warn('❌ Amount not detected automatically')
          console.warn('OCR Text Preview:', ocrText.substring(0, 500))

          // Show a more helpful error message
          const textPreview = ocrText.substring(0, 200).trim()
          const userAmount = prompt(
            `Could not detect total amount automatically.\n\nOCR detected text:\n"${textPreview}${ocrText.length > 200 ? '...' : ''}"\n\nPlease enter the receipt total amount:`,
            '0.00'
          )
          if (userAmount) {
            finalAmount = parseFloat(userAmount).toFixed(2)
            extractedData.amount = finalAmount
            console.log('✓ User entered amount:', finalAmount)
          } else {
            throw new Error('Receipt amount is required to save the receipt')
          }
        } else {
          console.log('✅ Amount detected successfully:', finalAmount)
        }

        const category = categorizeReceipt(extractedData.storeName, ocrText)
        console.log('Categorized as:', category)

        const expenseData = {
          amount: parseFloat(extractedData.amount),
          category,
          date: extractedData.date,
          paymentMethod: 'Credit Card'
        }

        // Save expense first and get its ID
        console.log('Saving expense:', expenseData)
        const savedExpense = addExpense(expenseData)
        console.log('Expense saved with ID:', savedExpense.id)

        // Save receipt with link to expense
        const receiptData = {
          ...extractedData,
          imageUri,
          ocrText,
          category,
          expenseId: savedExpense.id  // Link receipt to expense
        }

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
                    <button
                      className="btn-delete"
                      onClick={() => {
                        if (window.confirm(`Delete this receipt and its linked expense?\n\nStore: ${receipt.storeName}\nAmount: $${parseFloat(receipt.amount).toFixed(2)}\n\nThis will remove both the receipt and the expense from your records.`)) {
                          deleteReceipt(receipt.id)
                        }
                      }}
                    >
                      Delete
                    </button>
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
