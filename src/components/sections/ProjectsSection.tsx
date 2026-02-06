import { useMemo, useState } from 'react'
import type { Project, Employee } from '../../types'
import { Chip } from '../ui/Chip'
import { SearchBar } from '../ui/SearchBar'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { filterProjects } from '../../utils/projectsFilters'

type ProjectsSectionProps = {
  projects: Project[]
  employees: Employee[]
  onUpdateProjects: (projects: Project[]) => void
}

const projectPhases: Project['phase'][] = [
  'Planning',
  'Financed',
  'In Progress',
  'Canceled',
  'Completed',
]

export function ProjectsSection({
  projects,
  employees,
  onUpdateProjects,
}: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [newVendor, setNewVendor] = useState('')
  const [newExternalTeam, setNewExternalTeam] = useState('')
  const [draggedProject, setDraggedProject] = useState<Project | null>(null)

  const filteredProjects = useMemo(
    () => filterProjects(projects, searchTerm),
    [projects, searchTerm],
  )

  const handleProjectStatus = (
    projectId: string,
    status: Project['status'],
  ) => {
    onUpdateProjects(
      projects.map((project) =>
        project.id === projectId ? { ...project, status } : project,
      ),
    )
  }

  const handlePhaseChange = (projectId: string, newPhase: Project['phase']) => {
    onUpdateProjects(
      projects.map((project) =>
        project.id === projectId ? { ...project, phase: newPhase } : project
      )
    )
  }

  const handleDragStart = (e: React.DragEvent, project: Project) => {
    setDraggedProject(project)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetPhase: Project['phase']) => {
    e.preventDefault()
    if (draggedProject && draggedProject.phase !== targetPhase) {
      handlePhaseChange(draggedProject.id, targetPhase)
    }
    setDraggedProject(null)
  }

  return (
    <section id="projects" className="section">
      <div className="section-head">
        <div>
          <h2>Projects</h2>
          <p>Project delivery organized by phase.</p>
        </div>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by project, org, contact, phase, status..."
        />
      </div>
      <div className="kanban">
        {projectPhases.map((phase) => (
          <div 
            key={phase} 
            className="kanban-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, phase)}
          >
            <div className="kanban-head">
              <h3>{phase}</h3>
              <span>
                {projects.filter((project) => project.phase === phase).length}
              </span>
            </div>
            <div className="kanban-body">
              {filteredProjects
                .filter((project) => project.phase === phase)
                .map((project) => (
                  <div
                    key={project.id}
                    className="mini-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, project)}
                    onClick={() => setSelectedProject(project)}
                    style={{ cursor: 'grab' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <p className="mini-title" style={{ margin: 0 }}>{project.projectName}</p>
                      <select
                        value={project.phase}
                        onChange={(e) => {
                          e.stopPropagation()
                          handlePhaseChange(project.id, e.target.value as Project['phase'])
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
                        {projectPhases.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <p className="muted">{project.orgName}</p>
                    <Chip
                      className="small"
                      style={{
                        background:
                          project.status === 'Green'
                            ? 'var(--color-success)'
                            : project.status === 'Yellow'
                              ? 'var(--color-warning)'
                              : 'var(--color-danger)',
                        color: '#fff',
                      }}
                    >
                      {project.status}
                    </Chip>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={
          selectedProject ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
              <span style={{ flex: 1 }}>{selectedProject.projectName}</span>
              <button
                className="edit-modal-button"
                onClick={() => console.log('Edit Project:', selectedProject.id)}
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
        {selectedProject && (
          <>
            <div className="contact-modal-content">
              {/* Basic Information */}
              <div className="contact-section">
                <h4 className="section-title">Basic Information</h4>
                <div className="contact-grid">
                  <div className="contact-field">
                    <label>Project Name</label>
                    <span>{selectedProject.projectName}</span>
                  </div>
                  <div className="contact-field">
                    <label>Organization</label>
                    <span>{selectedProject.orgName}</span>
                  </div>
                  <div className="contact-field">
                    <label>Contact</label>
                    <span>{selectedProject.contactName}</span>
                  </div>
                  <div className="contact-field">
                    <label>Project Manager</label>
                    <span>{selectedProject.pmName}</span>
                  </div>
                  <div className="contact-field">
                    <label>Phase</label>
                    <span>{selectedProject.phase}</span>
                  </div>
                  <div className="contact-field">
                    <label>Status</label>
                    <select
                      className={`status-select ${selectedProject.status.toLowerCase()}`}
                      value={selectedProject.status}
                      onChange={(event) =>
                        handleProjectStatus(
                          selectedProject.id,
                          event.target.value as Project['status'],
                        )
                      }
                    >
                      <option value="Red">Red</option>
                      <option value="Yellow">Yellow</option>
                      <option value="Green">Green</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="contact-section">
                <h4 className="section-title">Project Details</h4>
                <div className="contact-grid">
                  <div className="contact-field">
                    <label>Start Date</label>
                    <span>{selectedProject.startDate}</span>
                  </div>
                  <div className="contact-field">
                    <label>Release Date</label>
                    <span>{selectedProject.releaseDate}</span>
                  </div>
                  <div className="contact-field">
                    <label>Budget</label>
                    <span>{selectedProject.budget}</span>
                  </div>
                  <div className="contact-field">
                    <label>Team Size</label>
                    <span>{selectedProject.teamSize}</span>
                  </div>
                </div>
              </div>

              {/* Our Employees on this Project */}
              {selectedProject.employeeIds && selectedProject.employeeIds.length > 0 && (
                <div className="contact-section">
                  <h4 className="section-title">Our Team Members</h4>
                  <div className="related-items">
                    {selectedProject.employeeIds
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

              {/* Vendors */}
              <div className="contact-section">
                <h4 className="section-title">Vendors</h4>
                <div className="entry-form">
                  <Input
                    value={newVendor}
                    onChange={(e) => setNewVendor(e.target.value)}
                    placeholder="Add a vendor..."
                  />
                  <Button
                    onClick={() => {
                      if (newVendor.trim()) {
                        const updatedProjects = projects.map(p =>
                          p.id === selectedProject.id
                            ? { ...p, vendors: [...(p.vendors || []), newVendor.trim()] }
                            : p
                        )
                        onUpdateProjects(updatedProjects)
                        setNewVendor('')
                        // Update local state
                        setSelectedProject({
                          ...selectedProject,
                          vendors: [...(selectedProject.vendors || []), newVendor.trim()]
                        })
                      }
                    }}
                  >
                    Add Vendor
                  </Button>
                </div>
                {selectedProject.vendors && selectedProject.vendors.length > 0 && (
                  <div className="related-items" style={{ marginTop: '12px' }}>
                    {selectedProject.vendors.map((vendor, idx) => (
                      <div key={idx} className="related-item" style={{ cursor: 'default' }}>
                        <div>
                          <p className="related-item-title">{vendor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* External Teams */}
              <div className="contact-section">
                <h4 className="section-title">External Teams</h4>
                <div className="entry-form">
                  <Input
                    value={newExternalTeam}
                    onChange={(e) => setNewExternalTeam(e.target.value)}
                    placeholder="Add an external team..."
                  />
                  <Button
                    onClick={() => {
                      if (newExternalTeam.trim()) {
                        const updatedProjects = projects.map(p =>
                          p.id === selectedProject.id
                            ? { ...p, externalTeams: [...(p.externalTeams || []), newExternalTeam.trim()] }
                            : p
                        )
                        onUpdateProjects(updatedProjects)
                        setNewExternalTeam('')
                        // Update local state
                        setSelectedProject({
                          ...selectedProject,
                          externalTeams: [...(selectedProject.externalTeams || []), newExternalTeam.trim()]
                        })
                      }
                    }}
                  >
                    Add Team
                  </Button>
                </div>
                {selectedProject.externalTeams && selectedProject.externalTeams.length > 0 && (
                  <div className="related-items" style={{ marginTop: '12px' }}>
                    {selectedProject.externalTeams.map((team, idx) => (
                      <div key={idx} className="related-item" style={{ cursor: 'default' }}>
                        <div>
                          <p className="related-item-title">{team}</p>
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
