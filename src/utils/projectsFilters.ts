import type { Project } from '../../types'

export function filterProjects(
  projects: Project[],
  searchTerm: string,
): Project[] {
  const term = searchTerm.trim().toLowerCase()
  if (!term) return projects

  return projects.filter((project) =>
    `${project.projectName} ${project.orgName} ${project.contactName} ${project.phase} ${project.status}`
      .toLowerCase()
      .includes(term),
  )
}
