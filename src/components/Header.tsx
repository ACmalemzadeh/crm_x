import { useState } from 'react'
import type { User } from '../types/auth'

type Section = {
  id: string
  label: string
  icon: string
}

type HeaderProps = {
  user: User
  sections: Section[]
  activeSection: string
  onSectionChange: (sectionId: string) => void
}

export function Header({ user, sections, activeSection, onSectionChange }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  
  return (
    <header className="topbar">
      <button 
        className="mobile-menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>
      
      <div className="brand">
        <div className="brand-icon">CX</div>
        <p className="brand-title">CRM X</p>
      </div>
      
      <nav className="header-nav">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`header-nav-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => onSectionChange(section.id)}
          >
            <span className="nav-icon">{section.icon}</span>
            <span className="nav-label">{section.label}</span>
          </button>
        ))}
      </nav>
      
      {menuOpen && (
        <div className="mobile-menu">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`mobile-menu-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => {
                onSectionChange(section.id)
                setMenuOpen(false)
              }}
            >
              <span className="nav-icon">{section.icon}</span>
              <span className="nav-label">{section.label}</span>
            </button>
          ))}
        </div>
      )}
      
      <div className="header-actions">
        <div className="user-badge">
          <span className="user-avatar">{user.name.charAt(0)}</span>
          <span className="user-name">{user.name}</span>
        </div>
      </div>
    </header>
  )
}
