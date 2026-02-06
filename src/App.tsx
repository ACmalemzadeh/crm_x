import { useState, useMemo } from 'react'
import './App.css'
import type { Contact, Project, UpdateEntry, Employee, Lead, Sow } from './types'
import {
  initialContacts,
  initialSows,
  initialLeads,
  leadPhases,
  initialProjects,
  initialResources,
} from './data/mockData'
import { expandContacts, expandResources } from './utils/dataGenerator'
import { currentUser, hasAccess } from './data/authData'
import { Header } from './components/Header'
import { Dashboard } from './components/sections/Dashboard'
import { ContactsSection } from './components/sections/ContactsSection'
import { SowSection } from './components/sections/SowSection'
import { LeadsSection } from './components/sections/LeadsSection'
import { ProjectsSection } from './components/sections/ProjectsSection'
import { ResourcesSection } from './components/sections/ResourcesSection'

type Section =
  | 'dashboard'
  | 'contacts'
  | 'sow'
  | 'leads'
  | 'projects'
  | 'employees'

function App() {
  // Generate expanded datasets - more performant than static large arrays
  const expandedContacts = useMemo(() => expandContacts(initialContacts, 200), [])
  const expandedResourcesBase = useMemo(() => expandResources(initialResources, 60), [])
  
  const [contacts, setContacts] = useState<Contact[]>(expandedContacts)
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [sows, setSows] = useState<Sow[]>(initialSows)
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [resources, setResources] = useState<Employee[]>(expandedResourcesBase)
  const [activeSection, setActiveSection] = useState<Section>('dashboard')
  const [updates, setUpdates] = useState<UpdateEntry[]>([
    {
      id: 'u-1',
      timestamp: '2026-02-06T14:30:00Z',
      user: 'John Doe',
      section: 'Contacts',
      cardId: 'c-1',
      cardTitle: 'Ava Thompson',
      action: 'viewed'
    },
    {
      id: 'u-2', 
      timestamp: '2026-02-06T13:15:00Z',
      user: 'Jane Smith',
      section: 'SOW',
      cardId: 's-1',
      cardTitle: 'Nexa Health Platform',
      action: 'updated'
    },
    {
      id: 'u-3',
      timestamp: '2026-02-06T12:45:00Z',
      user: 'Mike Johnson',
      section: 'Projects',
      cardId: 'p-1', 
      cardTitle: 'CareFlow Modernization',
      action: 'commented on'
    }
  ])

  const handleNavigateToSection = (section: string, cardId?: string) => {
    setActiveSection(section as Section)
    // In a real app, you might also highlight or scroll to the specific card
    if (cardId) {
      console.log(`Navigating to ${section} section, card: ${cardId}`)
    }
  }

  const sections = [
    { id: 'dashboard' as Section, label: 'Dashboard', icon: '📊' },
    { id: 'contacts' as Section, label: 'Contacts', icon: '👥' },
    { id: 'leads' as Section, label: 'Leads', icon: '🎯' },
    { id: 'sow' as Section, label: 'SOW', icon: '📄' },
    { id: 'projects' as Section, label: 'Projects', icon: '🚀' },
    { id: 'employees' as Section, label: 'Employees', icon: '💼' },
  ]

  const accessibleSections = sections.filter((section) =>
    hasAccess(currentUser, section.id),
  )

  return (
    <div className="app">
      <Header 
        user={currentUser}
        sections={accessibleSections}
        activeSection={activeSection}
        onSectionChange={(id) => setActiveSection(id as Section)}
      />
      
      <div className="app-layout">
        <main className="content">
          {activeSection === 'dashboard' && (
            <Dashboard 
              sows={sows} 
              employees={resources}
              projects={projects}
              leads={leads}
              contacts={contacts}
              updates={updates}
              onNavigateToSection={handleNavigateToSection}
            />
          )}
          {activeSection === 'contacts' && (
            <ContactsSection 
              contacts={contacts} 
              onUpdateContacts={setContacts}
              sows={sows}
              leads={leads}
            />
          )}
          {activeSection === 'leads' && (
            <LeadsSection
              leads={leads}
              contacts={contacts}
              sows={sows}
              phases={leadPhases}
              onUpdateLeads={setLeads}
            />
          )}
          {activeSection === 'sow' && (
            <SowSection 
              sows={sows} 
              employees={resources}
              onUpdateSows={setSows}
            />
          )}
          {activeSection === 'projects' && (
            <ProjectsSection 
              projects={projects} 
              employees={resources}
              onUpdateProjects={setProjects} 
            />
          )}
          {activeSection === 'employees' && (
            <ResourcesSection 
              resources={resources}
              sows={sows}
              onUpdateResources={setResources}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
