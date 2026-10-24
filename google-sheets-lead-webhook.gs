const SPREADSHEET_ID = '1iZstxdRsgwne9x1WZVRPm2Xfa8foFkPcwW3FXSE5S44'
const SHEET_NAME = 'Leads'
const WEBHOOK_TOKEN = PropertiesService.getScriptProperties().getProperty('WEBHOOK_TOKEN') || ''
const CANONICAL_HEADERS = ['Received at', 'Name', 'Phone', 'Email', 'Service', 'Source URL', 'Submitted at']
const REQUIRED_FIELDS = ['name', 'phone', 'email', 'service']
const HEADER_FIELDS = {
  received_at: null,
  name: 'name',
  phone: 'phone',
  email: 'email',
  service: 'service',
  source_url: 'page_url',
  submitted_at: 'submitted_at',
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: 'Missing request body' })
    }

    const payload = JSON.parse(e.postData.contents)
    const token = (e.parameter && e.parameter.token) || payload.token

    if (!token || token !== WEBHOOK_TOKEN) {
      return jsonResponse({ success: false, error: 'Unauthorized request' })
    }

    const data = payload.form_data || payload

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return jsonResponse({ success: false, error: 'Invalid request body' })
    }

    if (String(data._honey || '').trim()) {
      return jsonResponse({ success: true })
    }

    const missingFields = REQUIRED_FIELDS.filter((field) => !String(data[field] || '').trim())

    if (missingFields.length > 0) {
      return jsonResponse({ success: false, error: `Missing required fields: ${missingFields.join(', ')}` })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email).trim())) {
      return jsonResponse({ success: false, error: 'Invalid email address' })
    }

    const lock = LockService.getScriptLock()
    lock.waitLock(10000)

    try {
      const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME)

      if (!sheet) {
        throw new Error('Sheet tab not found')
      }

      const headers = ensureHeaders(sheet, CANONICAL_HEADERS)
      const row = headers.map((header) => normalizeHeader(header) === 'received_at' ? new Date() : getValue(header, data))
      sheet.appendRow(row)

      return jsonResponse({ success: true })
    } finally {
      lock.releaseLock()
    }
  } catch (error) {
    console.error(error)
    return jsonResponse({ success: false, error: 'Unable to save lead' })
  }
}

function doGet(e) {
  const token = e && e.parameter ? e.parameter.token : ''

  if (!token || token !== WEBHOOK_TOKEN) {
    return jsonResponse({ success: false, error: 'Unauthorized request' })
  }

  return jsonResponse({ success: true, message: 'Lead collection endpoint is reachable' })
}

function ensureHeaders(sheet, requiredHeaders) {
  const existingHeaders = sheet.getLastRow() > 0 && sheet.getLastColumn() > 0
    ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].filter(Boolean).map(String)
    : []

  if (existingHeaders.length === 0) {
    sheet.getRange(1, 1, 1, requiredHeaders.length).setValues([requiredHeaders])
    return requiredHeaders
  }

  requiredHeaders.forEach((header) => {
    if (!existingHeaders.some((existing) => existing.toLowerCase() === header.toLowerCase())) {
      sheet.insertColumnAfter(sheet.getLastColumn())
      sheet.getRange(1, sheet.getLastColumn()).setValue(header)
      existingHeaders.push(header)
    }
  })

  return existingHeaders
}

function getValue(header, data) {
  const normalizedHeader = normalizeHeader(header)
  const field = Object.prototype.hasOwnProperty.call(HEADER_FIELDS, normalizedHeader)
    ? HEADER_FIELDS[normalizedHeader]
    : header
  return safeValue(field ? data[field] : '')
}

function normalizeHeader(header) {
  return header.toLowerCase().replace(/\s+/g, '_')
}

function safeValue(value) {
  const text = value == null ? '' : String(value)
  return /^[\s]*[=+\-@]/.test(text) ? "'" + text : text
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON)
}
