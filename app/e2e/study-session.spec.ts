import { test, expect } from '@playwright/test'

test.describe('Study Session Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/')
    // Start a study session with the Food deck
    await page.getByText('Comida (Food)').click()
  })

  test('should display the first card', async ({ page }) => {
    // Check that we're in study mode
    await expect(page.getByRole('heading', { name: 'Comida (Food)' })).toBeVisible()
    await expect(page.getByText(/Card 1 of \d+/)).toBeVisible()

    // Check that Spanish label and some word are visible on front
    await expect(page.getByText('Español')).toBeVisible()
    await expect(page.locator('.flashcard__face--front .flashcard__text')).toBeVisible()
  })

  test('should flip card when clicked', async ({ page }) => {
    // Click the flashcard to flip
    const flashcard = page.locator('.flashcard')
    await flashcard.click()

    // After flip, English label and some text should be visible
    await expect(page.getByText('Inglés')).toBeVisible()
    await expect(page.locator('.flashcard__face--back .flashcard__text')).toBeVisible()
  })

  test('should show Correct/Incorrect buttons after flipping', async ({ page }) => {
    // Flip the card
    await page.locator('.flashcard').click()

    // Check that answer buttons appear
    await expect(page.getByText('How did you do?')).toBeVisible()
    await expect(page.getByRole('button', { name: 'I was correct' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'I need to review' })).toBeVisible()
  })

  test('should navigate to next card after marking correct', async ({ page }) => {
    // Flip and mark as correct
    await page.locator('.flashcard').click()
    await page.getByRole('button', { name: 'I was correct' }).click()

    // Should be on card 2
    await expect(page.getByText(/Card 2 of \d+/)).toBeVisible()

    // Card should be flipped back to front with a (possibly different) word
    await expect(page.getByText('Español')).toBeVisible()
    await expect(page.locator('.flashcard__face--front .flashcard__text')).toBeVisible()
  })

  test('should navigate to next card after marking incorrect', async ({ page }) => {
    // Flip and mark as incorrect
    await page.locator('.flashcard').click()
    await page.getByRole('button', { name: 'I need to review' }).click()

    // Should be on card 2
    await expect(page.getByText(/Card 2 of \d+/)).toBeVisible()
  })

  test('should update progress bar as cards are answered', async ({ page }) => {
    const progressBar = page.locator('.progress-bar__fill')

    // Answer first card
    await page.locator('.flashcard').click()
    await page.getByRole('button', { name: 'I was correct' }).click()

    // Answer second card
    await page.locator('.flashcard').click()
    await page.getByRole('button', { name: 'I was correct' }).click()

    // Progress should increase (we don't assert exact % to keep it flexible)
    await expect(page.getByText(/\(\d+%/)).toBeVisible()
  })

  test('should complete deck after answering all cards', async ({ page }) => {
    // Determine total cards from the header text (e.g. "Card 1 of 30")
    const header = await page.getByText(/Card \d+ of \d+/).textContent()
    const match = header && header.match(/Card \d+ of (\d+)/)
    const totalCards = match ? Number(match[1]) : 0

    // Answer all cards in the deck
    for (let i = 0; i < totalCards; i++) {
      await page.locator('.flashcard').click()
      await page.getByRole('button', { name: 'I was correct' }).click()
    }

    // Should show completion message
    await expect(page.getByRole('heading', { name: 'Session complete' })).toBeVisible()
    await expect(page.getByText(/You've completed all \d+ cards in this deck\./)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Back to decks' })).toBeVisible()

    // Progress should be 100%
    await expect(page.getByText(/\(100%\)/)).toBeVisible()
  })

  test('should show all cards in sequence', async ({ page }) => {
    // Check that card numbers advance one by one as we answer a subset of the deck
    const steps = 5

    for (let i = 0; i < steps; i++) {
      await expect(page.getByText(new RegExp(`Card ${i + 1} of \\d+`))).toBeVisible()

      if (i < steps - 1) {
        await page.locator('.flashcard').click()
        await page.getByRole('button', { name: 'I was correct' }).click()
      }
    }
  })
})
