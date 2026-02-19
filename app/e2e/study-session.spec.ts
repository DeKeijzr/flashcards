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
    await expect(page.getByText(/Card 1 of 5/)).toBeVisible()

    // Check that Spanish word is visible on front
    await expect(page.getByText('Español')).toBeVisible()
    await expect(page.getByText('la manzana')).toBeVisible()
  })

  test('should flip card when clicked', async ({ page }) => {
    // Initially, Spanish should be visible
    await expect(page.getByText('la manzana')).toBeVisible()

    // Click the flashcard to flip
    const flashcard = page.locator('.flashcard')
    await flashcard.click()

    // After flip, English should be visible
    await expect(page.getByText('Inglés')).toBeVisible()
    await expect(page.getByText('apple')).toBeVisible()
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
    await expect(page.getByText(/Card 2 of 5/)).toBeVisible()
    await expect(page.getByText(/\(20%\)/)).toBeVisible()

    // Card should be flipped back to front
    await expect(page.getByText('Español')).toBeVisible()
    await expect(page.getByText('el pan')).toBeVisible() // Second card
  })

  test('should navigate to next card after marking incorrect', async ({ page }) => {
    // Flip and mark as incorrect
    await page.locator('.flashcard').click()
    await page.getByRole('button', { name: 'I need to review' }).click()

    // Should be on card 2
    await expect(page.getByText(/Card 2 of 5/)).toBeVisible()
    await expect(page.getByText(/\(20%\)/)).toBeVisible()
  })

  test('should update progress bar as cards are answered', async ({ page }) => {
    const progressBar = page.locator('.progress-bar__fill')

    // Answer first card
    await page.locator('.flashcard').click()
    await page.getByRole('button', { name: 'I was correct' }).click()

    // Check progress bar width
    await expect(progressBar).toHaveCSS('width', /60px|61px|62px/) // Approximately 20% of ~300px

    // Answer second card
    await page.locator('.flashcard').click()
    await page.getByRole('button', { name: 'I was correct' }).click()

    // Progress should increase
    await expect(page.getByText(/\(40%\)/)).toBeVisible()
  })

  test('should complete deck after answering all cards', async ({ page }) => {
    const totalCards = 5

    // Answer all cards
    for (let i = 0; i < totalCards; i++) {
      await page.locator('.flashcard').click()
      await page.getByRole('button', { name: 'I was correct' }).click()
    }

    // Should show completion message
    await expect(page.getByRole('heading', { name: 'Session complete' })).toBeVisible()
    await expect(page.getByText(`You've completed all ${totalCards} cards in this deck.`)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Back to decks' })).toBeVisible()

    // Progress should be 100%
    await expect(page.getByText(/\(100%\)/)).toBeVisible()
  })

  test('should show all cards in sequence', async ({ page }) => {
    const expectedCards = ['la manzana', 'el pan', 'el queso', 'el café', 'el agua']

    for (let i = 0; i < expectedCards.length; i++) {
      // Check current card
      await expect(page.getByText(expectedCards[i])).toBeVisible()
      await expect(page.getByText(`Card ${i + 1} of 5`)).toBeVisible()

      // Answer and move to next (except last card)
      if (i < expectedCards.length - 1) {
        await page.locator('.flashcard').click()
        await page.getByRole('button', { name: 'I was correct' }).click()
      }
    }
  })
})
