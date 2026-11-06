import fs from 'node:fs'
import { expect, test } from '@playwright/test'

import { seedFilePath, type DashboardLocationSeed } from './dashboard-location-seed-path'

function readSeed(): DashboardLocationSeed {
  return JSON.parse(fs.readFileSync(seedFilePath, 'utf-8'))
}

test.describe('Dashboard location filter', () => {
  test('filters Rods and Catches to a single location', async ({ page }) => {
    const seed = readSeed()

    const loginResponse = await page.request.post('/api/frontend-auth/login', {
      data: { email: seed.email, password: seed.password },
    })
    expect(loginResponse.ok()).toBeTruthy()

    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: 'Fishing Dashboard' })).toBeVisible()

    const rodsAndCatchesSection = page.locator('section[aria-labelledby="rods-catches-heading"]')
    const riverRow = rodsAndCatchesSection.locator('tbody tr').filter({ hasText: 'river' })
    const riverRodsCount = riverRow.locator('td').nth(1)

    await expect(riverRodsCount).not.toHaveText('3')

    await rodsAndCatchesSection
      .getByRole('combobox', { name: 'Location' })
      .selectOption({ label: seed.locationALabel })
    await rodsAndCatchesSection.getByRole('button', { name: 'Apply' }).click()

    await expect(riverRodsCount).toHaveText('3')
    await expect(page).toHaveURL(new RegExp(`locationId=${seed.locationAId}`))

    await page.reload()
    await expect(riverRodsCount).toHaveText('3')
  })
})
