import { useMemo, useState } from 'react'
import type { Sow, Employee } from '../../types'
import { Chip } from '../ui/Chip'
import { SearchBar } from '../ui/SearchBar'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { filterSows } from '../../utils/sowFilters'

type SowSectionProps = {
  sows: Sow[]
  employees: Employee[]
  onUpdateSows: (sows: Sow[]) => void
}

const sowPhases: Sow['phase'][] = ['Lead', 'In Progress', 'Won', 'Completed']

export function SowSection({ sows, employees, onUpdateSows }: SowSectionProps) {
  const [selectedSow, setSelectedSow] = useState<Sow | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [newEntry, setNewEntry] = useState('')
  const [entryDate, setEntryDate] = useState('')
  const [draggedSow, setDraggedSow] = useState<Sow | null>(null)

  const handlePhaseChange = (sowId: string, newPhase: Sow['phase']) => {
    onUpdateSows(
      sows.map((sow) =>
        sow.id === sowId ? { ...sow, phase: newPhase } : sow
      )
    )
  }

  const handleDragStart = (e: React.DragEvent, sow: Sow) => {
    setDraggedSow(sow)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetPhase: Sow['phase']) => {
    e.preventDefault()
    if (draggedSow && draggedSow.phase !== targetPhase) {
      handlePhaseChange(draggedSow.id, targetPhase)
    }
    setDraggedSow(null)
  }

  const filteredSows = useMemo(
    () => filterSows(sows, searchTerm),
    [sows, searchTerm],
  )

  return (
    <section id="sow" className="section">
      <div className="section-head">
        <div>
          <h2>SOW</h2>
          <p>Statement of work contracts organized by phase.</p>
        </div>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by client, managers, value, file type..."
        />
      </div>
      <div className="kanban">
        {sowPhases.map((phase) => (
          <div 
            key={phase} 
            className="kanban-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, phase)}
          >
            <div className="kanban-head">
              <h3>{phase}</h3>
              <span>{sows.filter((sow) => sow.phase === phase).length}</span>
            </div>
            <div className="kanban-body">
              {filteredSows
                .filter((sow) => sow.phase === phase)
                .map((sow) => (
                  <div
                    key={sow.id}
                    className="mini-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, sow)}
                    onClick={() => setSelectedSow(sow)}
                    style={{ cursor: 'grab' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <p className="mini-title" style={{ margin: 0 }}>{sow.sowName}</p>
                      <select
                        value={sow.phase}
                        onChange={(e) => {
                          e.stopPropagation()
                          handlePhaseChange(sow.id, e.target.value as Sow['phase'])
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
                          minWidth: '110px'
                        }}
                      >
                        {sowPhases.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <p className="muted">{sow.client}</p>
                    <div className="lead-mini-info">
                      <span className="info-label">Client:</span>
                      <span className="info-value">{sow.clientPocName}</span>
                    </div>
                    <div className="lead-mini-info">
                      <span className="info-label">Our Manager:</span>
                      <span className="info-value">{sow.ourResourceManager}</span>
                    </div>
                    <div className="lead-mini-info">
                      <span className="info-label">Signed:</span>
                      <span className="info-value">{sow.signedDate}</span>
                    </div>
                    <Chip className="small">{sow.revenue}</Chip>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedSow}
        onClose={() => setSelectedSow(null)}
        title={
          selectedSow ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
              <span style={{ flex: 1 }}>{selectedSow.sowName}</span>
              <button
                className="edit-modal-button"
                onClick={() => console.log('Edit SOW:', selectedSow.id)}
                style={{
                  padding: '6px 12px',
                  fontSize: '14px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
            </div>
          ) : ''
        }
      >
        {selectedSow && (
          <>
            <div className="contact-modal-content">
              {/* Basic Information */}
              <div className="contact-section">
                <h4 className="section-title">Basic Information</h4>
                <div className="contact-grid">
                  <div className="contact-field">
                    <label>SOW Name</label>
                    <span>{selectedSow.sowName}</span>
                  </div>
                  <div className="contact-field">
                    <label>Client</label>
                    <span>{selectedSow.client}</span>
                  </div>
                  <div className="contact-field">
                    <label>Client</label>
                    <span>{selectedSow.clientPocName}</span>
                  </div>
                  <div className="contact-field">
                    <label>Client PM</label>
                    <span>{selectedSow.clientPmName}</span>
                  </div>
                  <div className="contact-field">
                    <label>Our Resource Manager</label>
                    <span>{selectedSow.ourResourceManager}</span>
                  </div>
                  <div className="contact-field">
                    <label>Phase</label>
                    <span>{selectedSow.phase}</span>
                  </div>
                  <div className="contact-field">
                    <label>Signed Date</label>
                    <span>{selectedSow.signedDate}</span>
                  </div>
                  <div className="contact-field">
                    <label>Revenue</label>
                    <span>{selectedSow.revenue}</span>
                  </div>
                </div>
              </div>

              {/* Contract Details */}
              <div className="contact-section">
                <h4 className="section-title">Contract Details</h4>
                <div className="contact-grid">
                  <div className="contact-field">
                    <label>Start Date</label>
                    <span>{selectedSow.startDate}</span>
                  </div>
                  <div className="contact-field">
                    <label>Expiry Date</label>
                    <span>{selectedSow.expiryDate}</span>
                  </div>
                  <div className="contact-field">
                    <label>Contract Value</label>
                    <span>{selectedSow.value}</span>
                  </div>
                  <div className="contact-field">
                    <label>Resources Allocated</label>
                    <span>{selectedSow.alethaResources}</span>
                  </div>
                  <div className="contact-field">
                    <label>File Type</label>
                    <span>{selectedSow.fileType} Contract</span>
                  </div>
                  <div className="contact-field">
                    <label>Contract File</label>
                    <a
                      href={selectedSow.contractLink}
                      className="linkedin-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Contract on SharePoint
                    </a>
                  </div>
                </div>
              </div>

              {/* Our Employees on this SOW */}
              {selectedSow.employeeIds.length > 0 && (
                <div className="contact-section">
                  <h4 className="section-title">Our Team Members</h4>
                  <div className="related-items">
                    {selectedSow.employeeIds
                      .map(empId => employees.find(e => e.id === empId))
                      .filter(emp => emp !== undefined)
                      .map(emp => (
                        <button
                          key={emp.id}
                          className="related-item"
                          onClick={() => {
                            console.log('Open employee modal:', emp.id)
                            // In future, this would open employee modal
                          }}
                        >
                          <div>
                            <p className="related-item-title">{emp.name}</p>
                            <p className="related-item-subtitle">{emp.title}</p>
                          </div>
                          <span className="related-item-arrow">→</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Comments & Activity */}
              <div className="contact-section">
                <h4 className="section-title">Comments & Activity</h4>
                
                {/* Add New Entry Form */}
                <div className="entry-form">
                  <div className="entry-form-fields">
                    <Input
                      type="date"
                      value={entryDate}
                      onChange={(e) => setEntryDate(e.target.value)}
                      placeholder="Date"
                    />
                    <Input
                      value={newEntry}
                      onChange={(e) => setNewEntry(e.target.value)}
                      placeholder="Add a note..."
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (newEntry.trim() && entryDate) {
                        console.log('Add entry:', { date: entryDate, text: newEntry })
                        setNewEntry('')
                        setEntryDate('')
                      }
                    }}
                  >
                    Add Note
                  </Button>
                </div>

                {/* Timeline Entries */}
                {selectedSow.entries.length > 0 && (
                  <div className="timeline-entries">
                    {[...selectedSow.entries]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((entry) => (
                        <div key={entry.id} className="timeline-entry">
                          <div className="timeline-marker"></div>
                          <div className="timeline-content">
                            <div className="timeline-header">
                              <span className="timeline-date">{entry.date}</span>
                            </div>
                            <p className="timeline-text">{entry.text}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </Modal>
    </section>
  )
}
