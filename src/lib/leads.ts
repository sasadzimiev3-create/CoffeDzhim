export type LeadSource = 'service' | 'contacts'

export type LeadPayload = {
  source: LeadSource
  name: string
  phone: string
  contact?: string
  comment?: string
  serviceType?: string
}

export async function sendLead(payload: LeadPayload) {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => null)) as
    | { error?: string; id?: number }
    | null

  if (!response.ok) {
    throw new Error(data?.error || 'Не удалось отправить заявку')
  }

  return data
}
