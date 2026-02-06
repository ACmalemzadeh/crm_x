import type { User, SectionAccess } from '../types/auth'

// Mock user - in production this would come from authentication service
export const currentUser: User = {
  id: 'u-1',
  name: 'John Admin',
  email: 'john@crmx.com',
  roles: ['admin', 'manager', 'sales', 'finance', 'hr'],
}

// Define which roles can access which sections
export const sectionAccess: SectionAccess = {
  dashboard: ['admin', 'manager', 'sales', 'finance', 'hr'],
  contacts: ['admin', 'manager', 'sales'],
  sow: ['admin', 'manager', 'finance'],
  leads: ['admin', 'manager', 'sales'],
  projects: ['admin', 'manager'],
  employees: ['admin', 'manager', 'hr'],
}

// Helper function to check if user has access to a section
export const hasAccess = (
  user: User,
  section: keyof SectionAccess,
): boolean => {
  const allowedRoles = sectionAccess[section]
  return user.roles.some((role) => allowedRoles.includes(role))
}
