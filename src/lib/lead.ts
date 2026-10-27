import { formSubmitAjaxEndpoint, formSubmitWebhook } from './site'

export type LeadPayload = {
  _subject: string
  _template: 'table'
  _url: string
  _honey: string
  name: string
  phone: string
  email: string
  service: string
  page_url: string
  submitted_at: string
  tyre_size?: string
  tyre_qty?: string
  notes?: string
  lead_source?: string
}

export function buildLeadPayload(fields: Partial<LeadPayload>): LeadPayload {
  return {
    _subject: 'New website lead — F&T Auto Services',
    _template: 'table',
    _url: window.location.href,
    _honey: '',
    name: '',
    phone: '',
    email: '',
    service: '',
    page_url: window.location.href,
    submitted_at: new Date().toISOString(),
    ...fields,
  }
}

/**
 * Sends a lead to both destinations:
 *  - formsubmit.co (email notification) — fire and forget, failures are logged only
 *  - the Google Sheets webhook (the source of truth) — awaited, throws on failure
 */
export async function submitLead(payload: LeadPayload): Promise<void> {
  if (!formSubmitWebhook) {
    throw new Error('Lead endpoint is not configured')
  }

  const emailRequest = fetch(formSubmitAjaxEndpoint, {
    method: 'POST',
    keepalive: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(async (response) => {
      const result = (await response.json().catch(() => ({}))) as { success?: boolean | string; message?: string }
      if (!response.ok || result.success === false) {
        throw new Error(result.message || 'Unable to submit form')
      }
    })
    .catch((error: unknown) => {
      console.error('FormSubmit email delivery failed', error)
    })

  const response = await fetch(formSubmitWebhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
    },
    body: JSON.stringify({ form_data: payload }),
  })
  const result = (await response.json().catch(() => ({}))) as { success?: boolean | string; message?: string }

  if (!response.ok || result.success === false) {
    throw new Error(result.message || 'Unable to save lead')
  }

  void emailRequest
}
