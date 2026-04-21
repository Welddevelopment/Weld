export const getInitials = (name: string) => name.slice(0, 2).toUpperCase()

export const isAvailableNow = (availability: string) =>
  availability.toLowerCase().includes('available now')
