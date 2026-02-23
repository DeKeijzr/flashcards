/**
 * Returns the singular or plural form of a word based on count.
 * Used for consistent "1 card" vs "2 cards" copy across the app.
 */
export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural
}
