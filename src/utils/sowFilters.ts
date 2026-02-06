import type { Sow } from '../types'

export function filterSows(sows: Sow[], searchTerm: string): Sow[] {
  const term = searchTerm.trim().toLowerCase()
  if (!term) return sows

  return sows.filter((sow) =>
    `${sow.client} ${sow.managers} ${sow.value} ${sow.fileType}`
      .toLowerCase()
      .includes(term),
  )
}
