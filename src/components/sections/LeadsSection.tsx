import { useMemo, useState } from 'react'
import type { Contact, Lead, Sow } from '../../types'
import { SearchBar } from '../ui/SearchBar'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { filterLeads } from '../../utils/leadsFilters'

type LeadsSectionProps = {
  leads: Lead[]
  contacts: Contact[]
  sows: Sow[]
  phases: string[]
  onUpdateLeads: (leads: Lead[]) => void
}

export function LeadsSection({ leads, contacts, sows, phases, onUpdateLeads }: LeadsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLead, setSelectedLead] = useState<{
    lead: Lead
    contact: Contact
  } | null>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [selectedSow, setSelectedSow] = useState<Sow | null>(null)
  const [newEntry, setNewEntry] = useState('')
  const [entryCost, setEntryCost] = useState('0')
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null)

  const handlePhaseChange = (leadId: string, newPhase: string) => {
    onUpdateLeads(
      leads.map((lead) =>
        lead.id === leadId ? { ...lead, phase: newPhase } : lead
      )
    )
  }

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetPhase: string) => {
    e.preventDefault()
    if (draggedLead && draggedLead.phase !== targetPhase) {
      handlePhaseChange(draggedLead.id, targetPhase)
    }
    setDraggedLead(null)
  }

  const handleAddEntry = () => {
    if (!newEntry.trim() || !selectedLead) return
    // In a real app, this would call an API to save the entry
    console.log('Adding entry:', newEntry, 'Cost:', entryCost)
    setNewEntry('')
    setEntryCost('0')
  }

  const handleContactClick = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId)
    if (contact) {
      setSelectedContact(contact)
    }
  }

  const handleSowClick = (sowId: string) => {
    const sow = sows.find(s => s.id === sowId)
    if (sow) {
      setSelectedSow(sow)
    }
  }

  const handleEditLead = () => {
    console.log('Edit lead:', selectedLead?.lead.id)
  }

  const handleAddNewLead = () => {
    console.log('Add new lead')
  }

  const filteredLeads = useMemo(
    () => filterLeads(leads, contacts, searchTerm),
    [leads, contacts, searchTerm],
  )

  return (
    <section id="leads" className="section">
      <div className="section-head">
        <div>
          <h2>Leads</h2>
          <p>Kanban view of engagement phases.</p>
        </div>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name, company, title, or phase..."
        />
      </div>
      <div className="kanban">
        {phases.map((phase) => (
          <div 
            key={phase} 
            className="kanban-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, phase)}
          >
            <div className="kanban-head">
              <h3>{phase}</h3>
              <span>{leads.filter((lead) => lead.phase === phase).length}</span>
              {phase === 'New' && (
                <button 
                  className="add-lead-btn" 
                  onClick={handleAddNewLead}
                  title="Add New Lead"
                >
                  +
                </button>
              )}
            </div>
            <div className="kanban-body">
              {filteredLeads
                .filter((lead) => lead.phase === phase)
                .map((lead) => {
                  const contact = contacts.find(
                    (item) => item.id === lead.contactId,
                  )
                  if (!contact) return null
                  return (
                    <div
                      key={lead.id}
                      className="mini-card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead)}
                      onClick={() => setSelectedLead({ lead, contact })}
                      style={{ cursor: 'grab' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <p className="mini-title" style={{ margin: 0 }}>{lead.leadName}</p>
                        <select
                          value={lead.phase}
                          onChange={(e) => {
                            e.stopPropagation()
                            handlePhaseChange(lead.id, e.target.value)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="phase-dropdown"
                          style={{
                            padding: '4px 8px',
                            fontSize: '12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            background: '#f8fafc',
                            cursor: 'pointer',
                            minWidth: '100px'
                          }}
                        >
                          {phases.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <p className="muted">{lead.clientOrgName}</p>
                      <div className="lead-mini-info">
                        <span className="info-label">Client Lead:</span>
                        <span className="info-value">{lead.clientLeadName}</span>
                      </div>
                      <div className="lead-mini-info">
                        <span className="info-label">Our Contact:</span>
                        <span className="info-value">{lead.myCompanyContactName}</span>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title={
          <div className="contact-modal-title">
            <span>{selectedLead?.lead.leadName || ''}</span>
            {selectedLead && (
              <button onClick={handleEditLead} className="edit-contact-btn">
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
        {selectedLead && (
          <>
            <div className="contact-modal-content">
              {/* Basic Information */}
              <div className="contact-section">
                <h4 className="section-title">Basic Information</h4>
                <div className="contact-grid">
                  <div className="contact-field">
                    <label>Lead Name</label>
                    <span>{selectedLead.lead.leadName}</span>
                  </div>
                  <div className="contact-field">
                    <label>Client Organization</label>
                    <span>{selectedLead.lead.clientOrgName}</span>
                  </div>
                  <div className="contact-field">
                    <label>Client Lead</label>
                    <span>{selectedLead.lead.clientLeadName}</span>
                  </div>
                  <div className="contact-field">
                    <label>Our Point of Contact</label>
                    <span>{selectedLead.lead.myCompanyContactName}</span>
                  </div>
                  <div className="contact-field">
                    <label>Phase</label>
                    <span>{selectedLead.lead.phase}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="contact-section">
                <h4 className="section-title">Description</h4>
                <p className="lead-description">{selectedLead.lead.description}</p>
              </div>

              {/* Project Estimates */}
              <div className="contact-section">
                <h4 className="section-title">Project Estimates</h4>
                <div className="contact-grid">
                  <div className="contact-field">
                    <label>Employees Required</label>
                    <span>{selectedLead.lead.employeesRequired}</span>
                  </div>
                  <div className="contact-field">
                    <label>Project Duration</label>
                    <span>{selectedLead.lead.projectDuration}</span>
                  </div>
                  <div className="contact-field">
                    <label>Potential Start Date</label>
                    <span>{selectedLead.lead.potentialStartDate}</span>
                  </div>
                  <div className="contact-field">
                    <label>Potential End Date</label>
                    <span>{selectedLead.lead.potentialEndDate}</span>
                  </div>
                  <div className="contact-field">
                    <label>Revenue Estimate</label>
                    <span>{selectedLead.lead.revenueEstimate}</span>
                  </div>
                  {selectedLead.lead.materialsLink && (
                    <div className="contact-field">
                      <label>Materials</label>
                      <a
                        href={selectedLead.lead.materialsLink}
                        className="linkedin-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Materials on SharePoint
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* SOW Link for Won Leads */}
              {selectedLead.lead.phase === 'Won' && selectedLead.lead.sowId && (
                <div className="contact-section">
                  <h4 className="section-title">Related SOW</h4>
                  <div className="related-items">
                    {(() => {
                      const sow = sows.find(s => s.id === selectedLead.lead.sowId)
                      return sow ? (
                        <button
                          className="related-item"
                          onClick={() => handleSowClick(sow.id)}
                        >
                          <div>
                            <p className="related-item-title">{sow.client}</p>
                            <p className="related-item-subtitle">
                              {sow.value} • {sow.phase}
                            </p>
                          </div>
                          <span className="related-item-arrow">→</span>
                        </button>
                      ) : null
                    })()}
                  </div>
                </div>
              )}

              {/* Client Side Contacts */}
              {selectedLead.lead.clientSideContacts.length > 0 && (
                <div className="contact-section">
                  <h4 className="section-title">Client Side Contacts</h4>
                  <div className="related-items">
                    {selectedLead.lead.clientSideContacts
                      .map(contactId => contacts.find(c => c.id === contactId))
                      .filter(contact => contact !== undefined)
                      .map(contact => (
                        <button
                          key={contact.id}
                          className="related-item"
                          onClick={() => handleContactClick(contact.id)}
                        >
                          <div>
                            <p className="related-item-title">{contact.fullName}</p>
                            <p className="related-item-subtitle">{contact.title}</p>
                          </div>
                          <span className="related-item-arrow">→</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* My Company Side Contacts */}
              {selectedLead.lead.myCompanySideContacts.length > 0 && (
                <div className="contact-section">
                  <h4 className="section-title">Our Team Contacts</h4>
                  <div className="related-items">
                    {selectedLead.lead.myCompanySideContacts
                      .map(contactId => contacts.find(c => c.id === contactId))
                      .filter(contact => contact !== undefined)
                      .map(contact => (
                        <button
                          key={contact.id}
                          className="related-item"
                          onClick={() => handleContactClick(contact.id)}
                        >
                          <div>
                            <p className="related-item-title">{contact.fullName}</p>
                            <p className="related-item-subtitle">{contact.title}</p>
                          </div>
                          <span className="related-item-arrow">→</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Meeting Notes & Activity */}
              <div className="contact-section">
                <h4 className="section-title">Meeting Notes & Activity</h4>
                <div className="timeline-entries">
                  {[...selectedLead.lead.entries]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((entry) => (
                      <div key={entry.id} className="timeline-entry">
                        <div className="timeline-entry-header">
                          <span className="timeline-date">{entry.date}</span>
                          <span className="timeline-cost">${entry.cost.toLocaleString()}</span>
                        </div>
                        <p className="timeline-text">{entry.text}</p>
                      </div>
                    ))}
                </div>

                <div className="entry-form-section">
                  <h5 className="entry-form-title">Add New Entry</h5>
                  <div className="entry-form">
                    <Input
                      value={newEntry}
                      onChange={(e) => setNewEntry(e.target.value)}
                      placeholder="Meeting notes or activity..."
                    />
                    <Input
                      type="number"
                      value={entryCost}
                      onChange={(e) => setEntryCost(e.target.value)}
                      placeholder="Cost ($)"
                    />
                    <Button onClick={handleAddEntry}>Add Entry</Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>

      <Modal
        isOpen={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        title={selectedContact?.fullName || ''}
      >
        {selectedContact && (
          <div className="contact-modal-content">
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
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!selectedSow}
        onClose={() => setSelectedSow(null)}
        title={selectedSow?.client || ''}
      >
        {selectedSow && (
          <div className="contact-modal-content">
            <div className="contact-section">
              <h4 className="section-title">SOW Details</h4>
              <div className="contact-grid">
                <div className="contact-field">
                  <label>Client</label>
                  <span>{selectedSow.client}</span>
                </div>
                <div className="contact-field">
                  <label>Value</label>
                  <span>{selectedSow.value}</span>
                </div>
                <div className="contact-field">
                  <label>Phase</label>
                  <span>{selectedSow.phase}</span>
                </div>
                <div className="contact-field">
                  <label>Start Date</label>
                  <span>{selectedSow.startDate}</span>
                </div>
                <div className="contact-field">
                  <label>Signed Date</label>
                  <span>{selectedSow.signedDate}</span>
                </div>
                <div className="contact-field">
                  <label>Expiry Date</label>
                  <span>{selectedSow.expiryDate}</span>
                </div>
                <div className="contact-field">
                  <label>Aletha Resources</label>
                  <span>{selectedSow.alethaResources}</span>
                </div>
                <div className="contact-field">
                  <label>Managers</label>
                  <span>{selectedSow.managers}</span>
                </div>
                <div className="contact-field">
                  <label>Contract</label>
                  <a
                    href={selectedSow.contractLink}
                    className="linkedin-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Contract
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
