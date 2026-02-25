import { test, expect } from '@playwright/test'

test.describe('Redo Wrong Cards Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/')
    await page.getByText('Meses del año (Months)').click()
  })

  test('should not show redo option when all cards are correct', async ({ page }) => {
    // Answer all cards as correct to reach completion state
    const header = await page.getByText(/Card \d+ of \d+/).textContent()
    const match = header && header.match(/Card \d+ of (\d+)/)
    const totalCards = match ? Number(match[1]) : 0

    for (let i = 0; i < totalCards; i++) {
      await page.locator('.flashcard').click()
      await page.getByRole('button', { name: 'I was correct' }).click()
    }

    // Should show completion but no redo button
    await expect(page.getByRole('heading', { name: 'Session complete' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Redo Wrong Cards' })).not.toBeVisible()
  })

  test('should show redo option when some cards are incorrect', async ({ page }) => {
    // Answer all cards; mark exactly two as incorrect
    const header = await page.getByText(/Card \d+ of \d+/).textContent()
    const match = header && header.match(/Card \d+ of (\d+)/)
    const totalCards = match ? Number(match[1]) : 0

    for (let i = 0; i < totalCards; i++) {
      await page.locator('.flashcard').click()
      if (i === 2 || i === 3) {
        // Mark as incorrect
        await page.getByRole('button', { name: 'I need to review' }).click()
      } else {
        // Mark as correct
        await page.getByRole('button', { name: 'I was correct' }).click()
      }
    }

    // Should show completion with redo option
    await expect(page.getByRole('heading', { name: 'Session complete' })).toBeVisible()
    await expect(page.getByText('2 cards marked as needing review.')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Redo Wrong Cards' })).toBeVisible()
  })

  test('should start redo session with only incorrect cards', async ({ page }) => {
    // Answer all cards; mark exactly three as incorrect
    const header = await page.getByText(/Card \d+ of \d+/).textContent()
    const match = header && header.match(/Card \d+ of (\d+)/)
    const totalCards = match ? Number(match[1]) : 0

    for (let i = 0; i < totalCards; i++) {
      await page.locator('.flashcard').click()
      if (i === 1 || i === 2 || i === 4) {
        await page.getByRole('button', { name: 'I need to review' }).click()
      } else {
        await page.getByRole('button', { name: 'I was correct' }).click()
      }
    }

    // Click redo button
    await page.getByRole('button', { name: 'Redo Wrong Cards' }).click()

    // Should be in redo session
    await expect(page.getByRole('heading', { name: /Meses del año \(Months\) - Review/ })).toBeVisible()
    await expect(page.getByText(/Card 1 of 3/)).toBeVisible() // Only 3 incorrect cards

    // Should show some Spanish word on the front face only
    const cardText = await page.locator('.flashcard__face--front .flashcard__text').textContent()
    expect(cardText).toBeTruthy()
  })

  test('should track answers independently in redo session', async ({ page }) => {
    // Mark first 2 cards as incorrect, rest as correct, then start redo
    const header = await page.getByText(/Card \d+ of \d+/).textContent()
    const match = header && header.match(/Card \d+ of (\d+)/)
    const totalCards = match ? Number(match[1]) : 0

    for (let i = 0; i < totalCards; i++) {
      await page.locator('.flashcard').click()
      if (i < 2) {
        await page.getByRole('button', { name: 'I need to review' }).click()
      } else {
        await page.getByRole('button', { name: 'I was correct' }).click()
      }
    }

    // Start redo session
    await page.getByRole('button', { name: 'Redo Wrong Cards' }).click()

    // Answer first card in redo as correct
    await page.locator('.flashcard').click()
    await page.getByRole('button', { name: 'I was correct' }).click()

    // Should move to second card
    await expect(page.getByText(/Card 2 of 2/)).toBeVisible()

    // Answer second card
    await page.locator('.flashcard').click()
    await page.getByRole('button', { name: 'I was correct' }).click()

    // Should show completion for redo session
    await expect(page.getByRole('heading', { name: 'Session complete' })).toBeVisible()
    await expect(page.getByText(/You've reviewed 2 card/)).toBeVisible()
  })

  test('should not show progress bar in redo session', async ({ page }) => {
    // Mark some cards as incorrect, rest correct, then start redo
    const header = await page.getByText(/Card \d+ of \d+/).textContent()
    const match = header && header.match(/Card \d+ of (\d+)/)
    const totalCards = match ? Number(match[1]) : 0

    for (let i = 0; i < totalCards; i++) {
      await page.locator('.flashcard').click()
      if (i < 2) {
        await page.getByRole('button', { name: 'I need to review' }).click()
      } else {
        await page.getByRole('button', { name: 'I was correct' }).click()
      }
    }

    // Start redo session
    await page.getByRole('button', { name: 'Redo Wrong Cards' }).click()

    // Progress bar should not be visible in redo session
    await expect(page.locator('.progress-bar')).not.toBeVisible()
  })

  test('should allow returning to decks from redo session completion', async ({ page }) => {
    // Complete a deck with some incorrect cards
    const header = await page.getByText(/Card \d+ of \d+/).textContent()
    const match = header && header.match(/Card \d+ of (\d+)/)
    const totalCards = match ? Number(match[1]) : 0

    for (let i = 0; i < totalCards; i++) {
      await page.locator('.flashcard').click()
      if (i < 2) {
        await page.getByRole('button', { name: 'I need to review' }).click()
      } else {
        await page.getByRole('button', { name: 'I was correct' }).click()
      }
    }

    // Start and complete redo session
    await page.getByRole('button', { name: 'Redo Wrong Cards' }).click()
    const redoHeader = await page.getByText(/Card \d+ of \d+/).textContent()
    const redoMatch = redoHeader && redoHeader.match(/Card \d+ of (\d+)/)
    const redoTotalCards = redoMatch ? Number(redoMatch[1]) : 0

    for (let i = 0; i < redoTotalCards; i++) {
      await page.locator('.flashcard').click()
      await page.getByRole('button', { name: 'I was correct' }).click()
    }

    // Click back to decks
    await page.getByRole('button', { name: 'Back to decks' }).click()

    // Should return to deck selection
    await expect(page.getByRole('heading', { name: 'Choose a deck' })).toBeVisible()
  })
})
