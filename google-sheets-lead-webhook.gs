const SPREADSHEET_ID = '1iZstxdRsgwne9x1WZVRPm2Xfa8foFkPcwW3FXSE5S44'
const SHEET_NAME = 'Leads'
const WEBHOOK_TOKEN = PropertiesService.getScriptProperties().getProperty('WEBHOOK_TOKEN') || ''
const CANONICAL_HEADERS = ['Received at', 'Name', 'Phone', 'Email', 'Service', 'Vehicle', 'Message', 'Source URL', 'Submitted at']
const HEADER_FIELDS = {
  received_at: null,
  name: 'name',
  phone: 'phone',
  email: 'email',
  service: 'service',
  vehicle: 'vehicle',
  message: 'message',
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
    const lock = LockService.getScriptLock()
    lock.waitLock(10000)

    try {
      const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME)

      if (!sheet) {
        throw new Error('Sheet tab not found')
      }

      const headers = ensureHeaders(sheet, getHeaders(data))
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

function getHeaders(data) {
  const knownFields = Object.values(HEADER_FIELDS).filter(Boolean)
  const additionalFields = Object.keys(data)
    .filter((field) => !field.startsWith('_') && !knownFields.includes(field))
    .sort()

  return [...CANONICAL_HEADERS, ...additionalFields]
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
