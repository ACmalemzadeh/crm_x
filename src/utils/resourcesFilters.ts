import type { Employee } from '../types'

export function filterResources(
  resources: Employee[],
  searchTerm: string,
): Employee[] {
  const term = searchTerm.trim().toLowerCase()
  if (!term) return resources

  return resources.filter((resource) =>
    `${resource.name} ${resource.title} ${resource.employeeId} ${resource.currentAccounts} ${resource.email}`
      .toLowerCase()
      .includes(term),
  )
}
