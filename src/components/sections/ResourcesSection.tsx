import { useMemo, useState } from 'react'
import type { Employee, Sow } from '../../types'
import { Card } from '../ui/Card'
import { Chip } from '../ui/Chip'
import { SearchBar } from '../ui/SearchBar'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { filterResources } from '../../utils/resourcesFilters'

type ResourcesSectionProps = {
  resources: Employee[]
  sows: Sow[]
  onUpdateResources?: (resources: Employee[]) => void
}

export function ResourcesSection({ resources, sows, onUpdateResources }: ResourcesSectionProps) {
  const [selectedResource, setSelectedResource] = useState<Employee | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [newSowId, setNewSowId] = useState('')
  const [newSowStartDate, setNewSowStartDate] = useState('')
  const [newSowEndDate, setNewSowEndDate] = useState('')
  const [newBenchStartDate, setNewBenchStartDate] = useState('')
  const [newBenchEndDate, setNewBenchEndDate] = useState('')

  const filteredResources = useMemo(
    () => filterResources(resources, searchTerm),
    [resources, searchTerm],
  )

  // Sort employees: active first (by employeeId), then left employees at bottom
  const sortedEmployees = useMemo(() => {
    const active = filteredResources.filter(emp => !emp.hasLeft)
    const left = filteredResources.filter(emp => emp.hasLeft)
    
    const sortByEmployeeId = (a: Employee, b: Employee) => 
      a.employeeId.localeCompare(b.employeeId)
    
    return [...active.sort(sortByEmployeeId), ...left.sort(sortByEmployeeId)]
  }, [filteredResources])

  return (
    <section id="employees" className="section">
      <div className="section-head">
        <div>
          <h2>Employees</h2>
          <p>Company talent with performance insights.</p>
        </div>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name, title, employee ID, accounts, email..."
        />
      </div>
      <div className="grid">
        {sortedEmployees.map((employee) => (
          <Card key={employee.id}>
            <button
              className="resource-head"
              type="button"
              onClick={() => setSelectedResource(employee)}
            >
              <div>
                <h3 style={employee.hasLeft ? { textDecoration: 'line-through', opacity: 0.6 } : undefined}>
                  {employee.name}
                </h3>
                <p className="muted">{employee.title}</p>
                <p className="muted" style={{ fontSize: '0.85rem' }}>
                  {employee.employeeId}
                </p>
              </div>
              <Chip style={employee.hasLeft ? { opacity: 0.6 } : undefined}>
                {employee.currentAccounts}
              </Chip>
            </button>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        title={
          selectedResource ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
              <span style={{ flex: 1 }}>{selectedResource.name}</span>
              <button
                className="edit-modal-button"
                onClick={() => console.log('Edit Employee:', selectedResource.id)}
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
        {selectedResource && (
          <>
            <div className="contact-modal-content">
              {/* Basic Information */}
              <div className="contact-section">
                <h4 className="section-title">Basic Information</h4>
                <div className="contact-grid">
                  <div className="contact-field">
                    <label>Employee ID</label>
                    <span>{selectedResource.employeeId}</span>
                  </div>
                  <div className="contact-field">
                    <label>Title</label>
                    <span>{selectedResource.title}</span>
                  </div>
                  <div className="contact-field">
                    <label>Status</label>
                    <span>
                      {selectedResource.hasLeft ? (
                        <Chip style={{ background: 'var(--color-danger)', color: '#fff' }}>
                          Left Organization
                        </Chip>
                      ) : (
                        <Chip style={{ background: 'var(--color-success)', color: '#fff' }}>
                          Active
                        </Chip>
                      )}
                    </span>
                  </div>
                  <div className="contact-field">
                    <label>Current Accounts</label>
                    <span>{selectedResource.currentAccounts}</span>
                  </div>
                  <div className="contact-field">
                    <label>Email</label>
                    <span>{selectedResource.email}</span>
                  </div>
                  <div className="contact-field">
                    <label>Address</label>
                    <span>{selectedResource.address}</span>
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div className="contact-section">
                <h4 className="section-title">Employment Details</h4>
                <div className="contact-grid">
                  <div className="contact-field">
                    <label>Start Date</label>
                    <span>{selectedResource.startDate}</span>
                  </div>
                  <div className="contact-field">
                    <label>Current Bench Time</label>
                    <span>{selectedResource.benchTime}</span>
                  </div>
                  <div className="contact-field">
                    <label>Salary</label>
                    <span>{selectedResource.salary}</span>
                  </div>
                  <div className="contact-field">
                    <label>SOW Valuation</label>
                    <span>{selectedResource.sowValuation}</span>
                  </div>
                  <div className="contact-field">
                    <label>Benefit to Date</label>
                    <span>{selectedResource.benefitToDate}</span>
                  </div>
                  <div className="contact-field">
                    <label>Recent Benefit</label>
                    <span>{selectedResource.benefitRecent}</span>
                  </div>
                  <div className="contact-field">
                    <label>Resume</label>
                    <a
                      href={selectedResource.resumeLink}
                      className="linkedin-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume on SharePoint
                    </a>
                  </div>
                </div>
              </div>

              {/* SOW Assignments */}
              <div className="contact-section">
                <h4 className="section-title">SOW Assignments</h4>
                
                {/* Add New SOW Assignment Form */}
                <div className="entry-form" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <select
                      value={newSowId}
                      onChange={(e) => setNewSowId(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)',
                        color: 'var(--color-text)',
                      }}
                    >
                      <option value="">Select SOW...</option>
                      {sows.map(sow => (
                        <option key={sow.id} value={sow.id}>{sow.sowName} - {sow.client}</option>
                      ))}
                    </select>
                    <Input
                      type="date"
                      value={newSowStartDate}
                      onChange={(e) => setNewSowStartDate(e.target.value)}
                      placeholder="Start Date"
                    />
                    <Input
                      type="date"
                      value={newSowEndDate}
                      onChange={(e) => setNewSowEndDate(e.target.value)}
                      placeholder="End Date"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (newSowId && newSowStartDate && onUpdateResources) {
                        const selectedSow = sows.find(s => s.id === newSowId)
                        if (selectedSow) {
                          const updatedResources = resources.map(r =>
                            r.id === selectedResource.id
                              ? {
                                  ...r,
                                  sowAssignments: [
                                    ...(r.sowAssignments || []),
                                    {
                                      sowId: newSowId,
                                      sowName: selectedSow.sowName,
                                      startDate: newSowStartDate,
                                      endDate: newSowEndDate || 'Present'
                                    }
                                  ]
                                }
                              : r
                          )
                          onUpdateResources(updatedResources)
                          setNewSowId('')
                          setNewSowStartDate('')
                          setNewSowEndDate('')
                          // Update local state
                          setSelectedResource({
                            ...selectedResource,
                            sowAssignments: [
                              ...(selectedResource.sowAssignments || []),
                              {
                                sowId: newSowId,
                                sowName: selectedSow.sowName,
                                startDate: newSowStartDate,
                                endDate: newSowEndDate || 'Present'
                              }
                            ]
                          })
                        }
                      }
                    }}
                  >
                    Add SOW Assignment
                  </Button>
                </div>

                {/* List of SOW Assignments */}
                {selectedResource.sowAssignments && selectedResource.sowAssignments.length > 0 ? (
                  <div className="related-items">
                    {selectedResource.sowAssignments.map((assignment, idx) => (
                      <div key={idx} className="related-item" style={{ cursor: 'default' }}>
                        <div style={{ flex: 1 }}>
                          <p className="related-item-title">{assignment.sowName}</p>
                          <p className="related-item-subtitle">
                            {assignment.startDate} → {assignment.endDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="muted" style={{ textAlign: 'center', padding: '16px' }}>
                    No SOW assignments yet
                  </p>
                )}
              </div>

              {/* Bench Periods */}
              <div className="contact-section">
                <h4 className="section-title">Bench Periods</h4>
                
                {/* Add New Bench Period Form */}
                <div className="entry-form" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <Input
                      type="date"
                      value={newBenchStartDate}
                      onChange={(e) => setNewBenchStartDate(e.target.value)}
                      placeholder="Start Date"
                    />
                    <Input
                      type="date"
                      value={newBenchEndDate}
                      onChange={(e) => setNewBenchEndDate(e.target.value)}
                      placeholder="End Date"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (newBenchStartDate && onUpdateResources) {
                        const updatedResources = resources.map(r =>
                          r.id === selectedResource.id
                            ? {
                                ...r,
                                benchPeriods: [
                                  ...(r.benchPeriods || []),
                                  {
                                    id: `bench-${Date.now()}`,
                                    startDate: newBenchStartDate,
                                    endDate: newBenchEndDate || 'Present'
                                  }
                                ]
                              }
                            : r
                        )
                        onUpdateResources(updatedResources)
                        setNewBenchStartDate('')
                        setNewBenchEndDate('')
                        // Update local state
                        setSelectedResource({
                          ...selectedResource,
                          benchPeriods: [
                            ...(selectedResource.benchPeriods || []),
                            {
                              id: `bench-${Date.now()}`,
                              startDate: newBenchStartDate,
                              endDate: newBenchEndDate || 'Present'
                            }
                          ]
                        })
                      }
                    }}
                  >
                    Add Bench Period
                  </Button>
                </div>

                {/* List of Bench Periods */}
                {selectedResource.benchPeriods && selectedResource.benchPeriods.length > 0 ? (
                  <div className="related-items">
                    {selectedResource.benchPeriods.map((period) => (
                      <div key={period.id} className="related-item" style={{ cursor: 'default' }}>
                        <div style={{ flex: 1 }}>
                          <p className="related-item-title">Bench Period</p>
                          <p className="related-item-subtitle">
                            {period.startDate} → {period.endDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="muted" style={{ textAlign: 'center', padding: '16px' }}>
                    No bench periods recorded
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </Modal>
    </section>
  )
}
