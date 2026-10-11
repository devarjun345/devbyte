# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: playwright-phase9.spec.ts >> Phase 9 - Real Browser QA >> AI Mentor chat
- Location: playwright-phase9.spec.ts:411:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/grow/ai-mentor
Call log:
  - navigating to "http://localhost:5173/grow/ai-mentor", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | const BASE_URL = 'http://localhost:5173';
  4   | 
  5   | async function setViewport(page: Page, width: number, height: number) {
  6   |   await page.setViewportSize({ width, height });
  7   |   await page.waitForTimeout(500);
  8   | }
  9   | 
  10  | async function navigateAndWait(page: Page, url: string) {
> 11  |   await page.goto(`${BASE_URL}${url}`);
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/grow/ai-mentor
  12  |   await page.waitForLoadState('networkidle');
  13  |   await page.waitForTimeout(500);
  14  | }
  15  | 
  16  | async function checkNoHorizontalOverflow(page: Page) {
  17  |   const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  18  |   const viewportWidth = await page.evaluate(() => window.innerWidth);
  19  |   if (bodyWidth > viewportWidth + 2) {
  20  |     throw new Error(`Horizontal overflow detected: body ${bodyWidth}px > viewport ${viewportWidth}px`);
  21  |   }
  22  | }
  23  | 
  24  | async function testCodeWorkspace(page: Page, width: number, height: number, label: string) {
  25  |   await setViewport(page, width, height);
  26  |   await navigateAndWait(page, '/practice/battle-arena/pair-sum');
  27  | 
  28  |   // Check no horizontal overflow
  29  |   await checkNoHorizontalOverflow(page);
  30  | 
  31  |   // Verify workspace loads - use specific selector for challenge title
  32  |   await expect(page.locator('.code-workspace-problem-header h2')).toContainText('Pair Sum');
  33  | 
  34  |   // Check problem panel exists
  35  |   const problemPanel = page.locator('.code-workspace-problem');
  36  |   await expect(problemPanel).toBeVisible();
  37  | 
  38  |   // Check editor panel exists
  39  |   const editorPanel = page.locator('.code-workspace-editor');
  40  |   await expect(editorPanel).toBeVisible();
  41  | 
  42  |   // Check tabs work
  43  |   const descriptionTab = page.locator('[role="tab"]:has-text("Description")');
  44  |   const examplesTab = page.locator('[role="tab"]:has-text("Examples")');
  45  |   const submissionsTab = page.locator('[role="tab"]:has-text("Submissions")');
  46  |   await expect(descriptionTab).toBeVisible();
  47  |   await expect(examplesTab).toBeVisible();
  48  |   await expect(submissionsTab).toBeVisible();
  49  | 
  50  |   // Test tab keyboard navigation
  51  |   await descriptionTab.focus();
  52  |   await page.keyboard.press('ArrowRight');
  53  |   await expect(examplesTab).toBeFocused();
  54  |   await page.keyboard.press('ArrowRight');
  55  |   await expect(submissionsTab).toBeFocused();
  56  |   await page.keyboard.press('ArrowLeft');
  57  |   await expect(examplesTab).toBeFocused();
  58  | 
  59  |   // Check language selector
  60  |   const languageSelect = page.locator('.code-workspace-language-select select');
  61  |   await expect(languageSelect).toBeVisible();
  62  |   await languageSelect.selectOption('Python');
  63  |   await expect(page.locator('.arena-code-editor')).toContainText('def pair_sum');
  64  |   await languageSelect.selectOption('JavaScript');
  65  |   await expect(page.locator('.arena-code-editor')).toContainText('function pairSum');
  66  |   await languageSelect.selectOption('TypeScript');
  67  |   await expect(page.locator('.arena-code-editor')).toContainText('function pairSum(values: number[], target: number): number[]');
  68  | 
  69  |   // Check editor has content
  70  |   await expect(page.locator('.arena-code-editor')).toHaveValue(/function pairSum/);
  71  | 
  72  |   // Check terminal
  73  |   const terminal = page.locator('.code-workspace-terminal');
  74  |   await expect(terminal).toBeVisible();
  75  | 
  76  |   // Check terminal toggle
  77  |   const terminalToggle = page.locator('.code-workspace-terminal-toggle');
  78  |   await expect(terminalToggle).toBeVisible();
  79  | 
  80  |   // Check Run/Submit buttons
  81  |   await expect(page.locator('button:has-text("Run sample preview")')).toBeVisible();
  82  |   await expect(page.locator('button:has-text("Submit preview")')).toBeVisible();
  83  | 
  84  |   // Test Run preview
  85  |   await page.click('button:has-text("Run sample preview")');
  86  |   await expect(page.locator('.code-workspace-terminal-content .feature-status-notice')).toBeVisible();
  87  | 
  88  |   // Test Submit preview
  89  |   await page.click('button:has-text("Submit preview")');
  90  |   await expect(page.locator('.code-workspace-terminal-content .feature-status-notice')).toBeVisible();
  91  | 
  92  |   // Check copy starter button
  93  |   const copyButton = page.locator('button:has-text("Copy starter")');
  94  |   await expect(copyButton).toBeVisible();
  95  | 
  96  |   console.log(`${label} (${width}x${height}): PASS`);
  97  | }
  98  | 
  99  | test.describe('Phase 9 - Real Browser QA', () => {
  100 |   test('CodeWorkspace at 1440px - desktop split layout', async ({ page }) => {
  101 |     await testCodeWorkspace(page, 1440, 1000, '1440px desktop');
  102 |   });
  103 | 
  104 |   test('CodeWorkspace at 1024px - tablet/laptop stacked', async ({ page }) => {
  105 |     await setViewport(page, 1024, 1000);
  106 |     await navigateAndWait(page, '/practice/battle-arena/pair-sum');
  107 |     await checkNoHorizontalOverflow(page);
  108 | 
  109 |     // At 1024px should be stacked layout
  110 |     await expect(page.locator('.code-workspace-problem-header h2')).toContainText('Pair Sum');
  111 |     await expect(page.locator('.code-workspace-problem')).toBeVisible();
```