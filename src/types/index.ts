export type SummaryEntry = {
  id: string
  date: string
  text: string
  cost: number
}

export type UpdateEntry = {
  id: string
  timestamp: string
  user: string
  section: string
  cardId: string
  cardTitle: string
  action: string
}

export type Contact = {
  id: string
  fullName: string
  company: string
  title: string
  leadState: string
  sows: number
  orgChart: string
  dietaryRestrictions: string
  favoriteDrink: string
  favoriteFood: string
  favoriteVacation: string
  maritalStatus: string
  spouseName?: string
  kids: string
  lastVacation?: string
  nextVacation?: string
  address: string
  phone: string
  workEmail: string
  personalEmail: string
  linkedinUrl?: string
  clubAddresses: string[]
  entries: SummaryEntry[]
}

export type Sow = {
  id: string
  sowName: string
  startDate: string
  signedDate: string
  expiryDate: string
  value: string
  revenue: string
  alethaResources: number
  employeeIds: string[] // IDs of our employees on this SOW
  client: string
  clientPocName: string // Client point of contact
  clientPmName: string // Client PM name
  ourResourceManager: string // Our resource managing this SOW
  managers: string
  fileType: 'PDF' | 'DOCX'
  phase: 'Lead' | 'In Progress' | 'Won' | 'Completed'
  contractLink: string
  entries: SummaryEntry[]
}

export type Lead = {
  id: string
  leadName: string
  clientOrgName: string
  clientLeadName: string
  myCompanyContactName: string
  contactId: string
  phase: string
  description: string
  clientSideContacts: string[] // contact IDs
  myCompanySideContacts: string[] // contact IDs
  employeesRequired: number
  projectDuration: string
  potentialStartDate: string
  potentialEndDate: string
  revenueEstimate: string
  sowId?: string // Links to SOW if phase is Won
  materialsLink?: string
  entries: SummaryEntry[]
}

export type Project = {
  id: string
  orgName: string
  projectName: string
  status: 'Red' | 'Yellow' | 'Green'
  contactName: string
  phase: 'Planning' | 'Financed' | 'In Progress' | 'Canceled' | 'Completed'
  startDate: string
  releaseDate: string
  pmName: string
  budget: string
  teamSize: string
  employeeIds: string[] // IDs of our employees on this project
  vendors: string[] // List of vendor names
  externalTeams: string[] // List of external team names
}

export type SowAssignment = {
  sowId: string
  sowName: string
  startDate: string
  endDate: string | 'Present'
}

export type BenchPeriod = {
  id: string
  startDate: string
  endDate: string | 'Present'
}

export type Employee = {
  id: string
  employeeId: string
  name: string
  title: string
  currentAccounts: string
  startDate: string
  benchTime: string
  salary: string
  resumeLink: string
  email: string
  address: string
  sowValuation: string
  benefitToDate: string
  benefitRecent: string
  hasLeft: boolean
  sowAssignments: SowAssignment[]
  benchPeriods: BenchPeriod[]
}

export type Resource = Employee // Keep for backwards compatibility
