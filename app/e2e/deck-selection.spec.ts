import { test, expect } from '@playwright/test'

test.describe('Deck Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/')
  })

  test('should display the app title and tagline', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Spanish Flashcards' })).toBeVisible()
    await expect(page.getByText('Practice decks, flip cards, and mark what you know.')).toBeVisible()
  })

  test('should display deck selection section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Choose a deck' })).toBeVisible()
    await expect(page.getByText('Start with a topic and go through each card in the deck.')).toBeVisible()
  })

  test('should display available decks', async ({ page }) => {
    // Check that deck cards are visible
    const deckCards = page.locator('.deck-card')
    const count = await deckCards.count()
    expect(count).toBeGreaterThan(3)

    // Check first deck (Food)
    await expect(page.getByText('Comida (Food)')).toBeVisible()
    await expect(page.getByText('Common food-related vocabulary')).toBeVisible()
    await expect(deckCards.filter({ hasText: 'Comida (Food)' }).getByText(/cards/)).toBeVisible()

    // Check second deck (Travel)
    await expect(page.getByText('Viajes (Travel)')).toBeVisible()
    await expect(page.getByText('Words you will use while traveling')).toBeVisible()
    await expect(deckCards.filter({ hasText: 'Viajes (Travel)' }).getByText(/cards/)).toBeVisible()

    // Check some specific decks exist
    await expect(page.getByText('Guatemalan Slang')).toBeVisible()
    await expect(page.getByText('Reggaeton & Party')).toBeVisible()
    await expect(page.getByText('Comida (Food)')).toBeVisible()
  })

  test('should navigate to study session when clicking a deck', async ({ page }) => {
    // Click on the first deck
    await page.getByText('Comida (Food)').click()

    // Should be in study session
    await expect(page.getByRole('heading', { name: 'Comida (Food)' })).toBeVisible()
    await expect(page.getByText(/Card 1 of \d+/)).toBeVisible()
    await expect(page.getByText(/\(0%\)/)).toBeVisible()
  })

  test('should show back link in study session', async ({ page }) => {
    await page.getByText('Comida (Food)').click()

    const backLink = page.getByRole('button', { name: '← All decks' })
    await expect(backLink).toBeVisible()

    // Click back link
    await backLink.click()

    // Should return to deck selection
    await expect(page.getByRole('heading', { name: 'Choose a deck' })).toBeVisible()
  })
})
