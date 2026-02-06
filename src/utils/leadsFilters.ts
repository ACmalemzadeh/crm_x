import type { Lead, Contact } from '../../types'

export function filterLeads(
  leads: Lead[],
  contacts: Contact[],
  searchTerm: string,
): Lead[] {
  const term = searchTerm.trim().toLowerCase()
  if (!term) return leads

  return leads.filter((lead) => {
    const contact = contacts.find((c) => c.id === lead.contactId)
    if (!contact) return false
    return (
      contact.fullName.toLowerCase().includes(term) ||
      contact.company.toLowerCase().includes(term) ||
      contact.title.toLowerCase().includes(term) ||
      lead.phase.toLowerCase().includes(term)
    )
  })
}
