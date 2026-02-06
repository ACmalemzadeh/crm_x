export type UserRole = 'admin' | 'manager' | 'sales' | 'hr' | 'finance'

export type User = {
  id: string
  name: string
  email: string
  roles: UserRole[]
}

export type SectionAccess = {
  contacts: UserRole[]
  sow: UserRole[]
  leads: UserRole[]
  projects: UserRole[]
  employees: UserRole[]
  dashboard: UserRole[]
}
