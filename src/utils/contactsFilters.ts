import type { Contact } from '../../types'

export function filterContacts(
  contacts: Contact[],
  searchTerm: string,
): Contact[] {
  const term = searchTerm.trim().toLowerCase()
  if (!term) return contacts

  return contacts.filter((contact) => {
    const entryMatch = contact.entries.some((entry) =>
      `${entry.date} ${entry.text}`.toLowerCase().includes(term),
    )
    return (
      `${contact.fullName} ${contact.company} ${contact.title} ${contact.leadState} ${contact.sows}`
        .toLowerCase()
        .includes(term) || entryMatch
    )
  })
}
