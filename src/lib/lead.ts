import { formSubmitAjaxEndpoint, formSubmitConfig, formSubmitWebhook } from './site'

export type LeadPayload = {
  name: string
  phone: string
  email: string
  service: string
  lead_source: string
  submitted_at: string
}

export function buildLeadPayload(fields: Partial<LeadPayload>): LeadPayload {
  return {
    name: '',
    phone: '',
    email: '',
    service: '',
    lead_source: 'Callback form',
    submitted_at: new Date().toISOString(),
    ...fields,
  }
}

async function saveToSheet(payload: LeadPayload): Promise<void> {
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
}

async function emailLead(payload: LeadPayload): Promise<void> {
  const response = await fetch(formSubmitAjaxEndpoint, {
    method: 'POST',
    keepalive: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...formSubmitConfig, ...payload }),
  })

  const result = (await response.json().catch(() => ({}))) as { success?: boolean | string; message?: string }

  if (!response.ok || result.success === false) {
    throw new Error(result.message || 'Unable to submit form')
  }
}

/**
 * Sends a lead to both destinations:
 *  - the Google Sheets webhook (the source of truth) — the row is written to the Leads sheet
 *  - formsubmit.co (email notification) — fire and forget, so a formsubmit outage never breaks the form
 * The form only reports a failure when every configured destination rejects the lead.
 */
export async function submitLead(payload: LeadPayload): Promise<void> {
  const attempts: Array<Promise<void>> = []

  if (formSubmitWebhook) {
    attempts.push(saveToSheet(payload))
  }

  attempts.push(emailLead(payload))

  const results = await Promise.allSettled(attempts)

  if (results.every((result) => result.status === 'rejected')) {
    throw (results[0] as PromiseRejectedResult).reason
  }
}
