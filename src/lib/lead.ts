import { formSubmitAjaxEndpoint, formSubmitConfig } from './site'

export type LeadPayload = {
  name: string
  phone: string
  email: string
  service: string
}

export function buildLeadPayload(fields: Partial<LeadPayload>): LeadPayload {
  return {
    name: '',
    phone: '',
    email: '',
    service: '',
    ...fields,
  }
}

/**
 * Sends a lead to formsubmit.co, which emails the notification to the business inbox.
 * Awaited so the form can report a failure back to the visitor.
 */
export async function submitLead(payload: LeadPayload): Promise<void> {
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
