import { useMemo, useState } from 'react'
import type { Contact, SummaryEntry, Sow, Lead } from '../../types'
import { Chip } from '../ui/Chip'
import { SearchBar } from '../ui/SearchBar'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { filterContacts } from '../../utils/contactsFilters'

type ContactsSectionProps = {
  contacts: Contact[]
  onUpdateContacts: (contacts: Contact[]) => void
  sows: Sow[]
  leads: Lead[]
}

export function ContactsSection({
  contacts,
  onUpdateContacts,
  sows,
  leads,
}: ContactsSectionProps) {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null,
  )
  const [contactSearch, setContactSearch] = useState('')
  const [entryDate, setEntryDate] = useState('')
  const [entryText, setEntryText] = useState('')
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)

  const selectedContact = contacts.find((c) => c.id === selectedContactId)

  const handleEditContact = () => {
    // In a real app, this would open an edit form or navigate to edit page
    console.log('Editing contact:', selectedContact?.fullName)
  }

  // Helper function to find related SOWs
  const getRelatedSows = (contact: Contact) => {
    return sows.filter(sow => 
      sow.client.toLowerCase().includes(contact.company.toLowerCase()) ||
      sow.managers.toLowerCase().includes(contact.fullName.toLowerCase())
    )
  }

  // Helper function to find related Leads
  const getRelatedLeads = (contact: Contact) => {
    return leads.filter(lead => lead.contactId === contact.id)
  }

  const filteredContacts = useMemo(
    () => filterContacts(contacts, contactSearch),
    [contacts, contactSearch],
  )

  const sortedEntries = useMemo(() => {
    if (!selectedContact) return []
    return [...selectedContact.entries].sort((a, b) =>
      b.date.localeCompare(a.date),
    )
  }, [selectedContact])

  const handleSelectContact = (contact: Contact) => {
    setSelectedContactId(contact.id)
    setEntryDate('')
    setEntryText('')
    setEditingEntryId(null)
  }

  const handleSaveEntry = () => {
    if (!selectedContact || !entryDate || !entryText.trim()) return
    onUpdateContacts(
      contacts.map((contact) => {
        if (contact.id !== selectedContact.id) return contact
        if (editingEntryId) {
          return {
            ...contact,
            entries: contact.entries.map((entry) =>
              entry.id === editingEntryId
                ? { ...entry, date: entryDate, text: entryText }
                : entry,
            ),
          }
        }
        return {
          ...contact,
          entries: [
            { id: `${Date.now()}`, date: entryDate, text: entryText, cost: 0 },
            ...contact.entries,
          ],
        }
      }),
    )
    setEntryDate('')
    setEntryText('')
    setEditingEntryId(null)
  }

  const handleEditEntry = (entry: SummaryEntry) => {
    setEntryDate(entry.date)
    setEntryText(entry.text)
    setEditingEntryId(entry.id)
  }

  return (
    <section id="contacts" className="section">
      <div className="section-head">
        <div>
          <h2>Contacts</h2>
          <p>Search by any field or summary entry.</p>
        </div>
        <SearchBar
          value={contactSearch}
          onChange={setContactSearch}
          placeholder="Search contacts, entries, titles, companies..."
        />
      </div>

      <div className="grid">
        {filteredContacts.map((contact) => {
          const relatedLeads = getRelatedLeads(contact)
          return (
            <button
              key={contact.id}
              type="button"
              className="card contact-card"
              onClick={() => handleSelectContact(contact)}
            >
              <div className="card-header">
                <div>
                  <h3>{contact.fullName}</h3>
                  <p>{contact.title}</p>
                </div>
              </div>
              <div className="card-body">
                <p className="muted">{contact.company}</p>
                <div className="stat-row">
                  <span>Leads</span>
                  <strong>{relatedLeads.length}</strong>
                </div>
                <div className="stat-row">
                  <span>SOWs</span>
                  <strong>{contact.sows}</strong>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <Modal
        isOpen={!!selectedContact}
        onClose={() => setSelectedContactId(null)}
        title={
          <div className="contact-modal-title">
            <span>{selectedContact?.fullName || ''}</span>
            {selectedContact && (
              <button onClick={handleEditContact} className="edit-contact-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit
              </button>
            )}
          </div>
        }
      >
        {selectedContact && (
          <>
            <div className="contact-modal-content">
              {/* Main Info Section */}
              <div className="contact-section">
                <h4 className="section-title">Professional Information</h4>
                <div className="contact-grid">
                  <div className="contact-field">
                    <label>Company</label>
                    <span>{selectedContact.company}</span>
                  </div>
                  <div className="contact-field">
                    <label>Title</label>
                    <span>{selectedContact.title}</span>
                  </div>
                  <div className="contact-field">
                    <label>Lead State</label>
                    <span>{selectedContact.leadState}</span>
                  </div>
                  <div className="contact-field">
                    <label>Org Chart</label>
                    <span>{selectedContact.orgChart}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="contact-section">
                <h4 className="section-title">Contact Information</h4>
                <div className="contact-grid">
                  <div className="contact-field">
                    <label>Address</label>
                    <span>{selectedContact.address || 'Not provided'}</span>
                  </div>
                  <div className="contact-field">
                    <label>Phone</label>
                    <span>{selectedContact.phone || 'Not provided'}</span>
                  </div>
                  <div className="contact-field">
                    <label>Work Email</label>
                    <span>{selectedContact.workEmail || 'Not provided'}</span>
                  </div>
                  <div className="contact-field">
                    <label>Personal Email</label>
                    <span>{selectedContact.personalEmail || 'Not provided'}</span>
                  </div>
                  {selectedContact.linkedinUrl && (
                    <div className="contact-field">
                      <label>LinkedIn</label>
                      <a 
                        href={selectedContact.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="linkedin-link"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        View LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className="contact-section">
                <h4 className="section-title">Personal Information</h4>
                <div className="contact-grid">
                  <div className="contact-field">
                    <label>Marital Status</label>
                    <span>{selectedContact.maritalStatus}</span>
                  </div>
                  {selectedContact.spouseName && (
                    <div className="contact-field">
                      <label>Spouse</label>
                      <span>{selectedContact.spouseName}</span>
                    </div>
                  )}
                  <div className="contact-field">
                    <label>Children</label>
                    <span>{selectedContact.kids}</span>
                  </div>
                  <div className="contact-field">
                    <label>Dietary Restrictions</label>
                    <span>{selectedContact.dietaryRestrictions}</span>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="contact-section">
                <h4 className="section-title">Preferences & Interests</h4>
                <div className="contact-grid">
                  <div className="contact-field">
                    <label>Favorite Drink</label>
                    <span>{selectedContact.favoriteDrink}</span>
                  </div>
                  <div className="contact-field">
                    <label>Favorite Food</label>
                    <span>{selectedContact.favoriteFood}</span>
                  </div>
                  <div className="contact-field">
                    <label>Favorite Vacation</label>
                    <span>{selectedContact.favoriteVacation}</span>
                  </div>
                  {selectedContact.lastVacation && (
                    <div className="contact-field">
                      <label>Last Vacation</label>
                      <span>{selectedContact.lastVacation}</span>
                    </div>
                  )}
                  {selectedContact.nextVacation && (
                    <div className="contact-field">
                      <label>Next Vacation</label>
                      <span>{selectedContact.nextVacation}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Club Memberships */}
              {selectedContact.clubAddresses && selectedContact.clubAddresses.length > 0 && (
                <div className="contact-section">
                  <h4 className="section-title">Club Memberships</h4>
                  <div className="club-list">
                    {selectedContact.clubAddresses.map((club, index) => (
                      <div key={index} className="club-item">
                        <span>{club}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related SOWs */}
              {(() => {
                const relatedSows = getRelatedSows(selectedContact)
                return relatedSows.length > 0 && (
                  <div className="contact-section">
                    <h4 className="section-title">Related SOWs ({relatedSows.length})</h4>
                    <div className="related-items">
                      {relatedSows.map(sow => (
                        <div key={sow.id} className="related-item">
                          <div className="related-info">
                            <span className="related-name">{sow.client}</span>
                            <span className="related-detail">{sow.value} • {sow.phase}</span>
                          </div>
                          <Chip className="small">{sow.phase}</Chip>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* Related Leads */}
              {(() => {
                const relatedLeads = getRelatedLeads(selectedContact)
                return relatedLeads.length > 0 && (
                  <div className="contact-section">
                    <h4 className="section-title">Related Leads ({relatedLeads.length})</h4>
                    <div className="related-items">
                      {relatedLeads.map(lead => (
                        <div key={lead.id} className="related-item">
                          <div className="related-info">
                            <span className="related-name">Lead #{lead.id}</span>
                            <span className="related-detail">{lead.phase}</span>
                          </div>
                          <Chip className="small">{lead.phase}</Chip>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>

            <div className="entry-wrap">
              <div className="entry-form">
                <h4>Summary Entry</h4>
                <div className="entry-fields">
                  <Input
                    type="date"
                    value={entryDate}
                    onChange={(event) => setEntryDate(event.target.value)}
                  />
                  <textarea
                    className="input textarea"
                    placeholder="Add meeting notes, follow-ups, next steps..."
                    value={entryText}
                    onChange={(event) => setEntryText(event.target.value)}
                  />
                </div>
                <Button type="button" onClick={handleSaveEntry}>
                  {editingEntryId ? 'Update Entry' : 'Save Entry'}
                </Button>
              </div>

              <div className="entry-list">
                <h4>Timeline</h4>
                {sortedEntries.map((entry) => (
                  <div key={entry.id} className="entry-card">
                    <div>
                      <p className="entry-date">{entry.date}</p>
                      <p>{entry.text}</p>
                    </div>
                    <Button
                      variant="link"
                      type="button"
                      onClick={() => handleEditEntry(entry)}
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Modal>
    </section>
  )
}
