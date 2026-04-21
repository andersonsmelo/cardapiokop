import { test, expect } from '@playwright/test';

test('Home page loads correctly and displays brand logo', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the page to load
  await expect(page).toHaveTitle(/Kopenhagen/i);
  
  // Verify the header contains Kopenhagen logo text (assuming 'K' or full logo is there)
  // In our QA report we saw: <div className="... text-brand-red font-heading text-3xl ...">K</div> 
  const logo = page.locator('text=K').first();
  await expect(logo).toBeVisible();
});
