import type { Contact, Employee } from '../types'

/**
 * Generates additional contacts based on a seed contact
 * This is more performant than storing 200 static contacts in the bundle
 */
export function expandContacts(seedContacts: Contact[], targetCount: number): Contact[] {
  if (seedContacts.length >= targetCount) return seedContacts

  const expanded: Contact[] = [...seedContacts]
  const firstNames = ['Ava', 'Ethan', 'Sophia', 'Liam', 'Isabella', 'Noah', 'Olivia', 'Lucas', 'Emma', 'Mason', 'Mia', 'Logan', 'Charlotte', 'Elijah', 'Amelia', 'James', 'Harper', 'Benjamin', 'Evelyn', 'William']
  const lastNames = ['Thompson', 'Collins', 'Martinez', 'Rodriguez', 'Garcia', 'Wilson', 'Anderson', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King']
  
  for (let i = seedContacts.length; i < targetCount; i++) {
    const seedIndex = i % seedContacts.length
    const seed = seedContacts[seedIndex]
    const variant = Math.floor(i / seedContacts.length) + 1
    
    expanded.push({
      ...seed,
      id: `c-${i + 1}`,
      fullName: `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / firstNames.length) % lastNames.length]}${variant > 1 ? ` ${variant}` : ''}`,
      entries: [
        {
          id: `e-${i + 1}-1`,
          date: `2026-${String(((i % 12) + 1)).padStart(2, '0')}-${String(((i % 28) + 1)).padStart(2, '0')}`,
          text: 'Initial contact meeting to discuss project requirements.',
          cost: 2500,
        },
      ],
    })
  }
  
  return expanded
}

/**
 * Generates additional employees based on seed employees
 * More efficient than static array - reduces initial bundle size
 */
export function expandResources(seedResources: Employee[], targetCount: number): Employee[] {
  if (seedResources.length >= targetCount) return seedResources

  const expanded: Employee[] = [...seedResources]
  const firstNames = ['Maya', 'Liam', 'Zara', 'Jordan', 'Riley', 'Alex', 'Taylor', 'Morgan', 'Casey', 'Drew']
  const lastNames = ['Patel', 'Reyes', 'Brooks', 'Ellis', 'Chen', 'Rivera', 'Kim', 'Lee', 'Park', 'Martinez']
  const titles = ['Senior Software Engineer', 'DevOps Engineer', 'Full Stack Developer', 'Data Scientist', 'UI/UX Designer', 'Product Manager', 'Technical Lead', 'Cloud Architect', 'QA Engineer', 'Security Analyst']
  
  for (let i = seedResources.length; i < targetCount; i++) {
    const seedIndex = i % seedResources.length
    const seed = seedResources[seedIndex]
    const variant = Math.floor(i / seedResources.length) + 1
    const salary = 80000 + (i * 2000)
    const sowVal = 100000 + (i * 5000)
    
    expanded.push({
      ...seed,
      id: `r-${i + 1}`,
      employeeId: `EMP-${1000 + i + 1}`,
      name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}${variant > 1 ? ` ${variant}` : ''}`,
      title: titles[i % titles.length],
      startDate: `${2020 + (i % 6)}-${String(((i % 12) + 1)).padStart(2, '0')}-01`,
      benchTime: `${i % 7} months`,
      salary: `$${salary.toLocaleString()}`,
      resumeLink: `https://sharepoint.company.com/resumes/${firstNames[i % firstNames.length].toLowerCase()}-${lastNames[i % lastNames.length].toLowerCase()}.pdf`,
      email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}${variant > 1 ? variant : ''}@company.com`,
      sowValuation: `$${sowVal.toLocaleString()}`,
      benefitToDate: `$${(sowVal - (salary * (i % 3 + 1))).toLocaleString()}`,
      hasLeft: false,
      sowAssignments: seed.sowAssignments || [],
      benchPeriods: seed.benchPeriods || [],
    })
  }
  
  return expanded
}
