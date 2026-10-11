import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

async function setViewport(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(500);
}

async function navigateAndWait(page: Page, url: string) {
  await page.goto(`${BASE_URL}${url}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
}

async function checkNoHorizontalOverflow(page: Page) {
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  if (bodyWidth > viewportWidth + 2) {
    throw new Error(`Horizontal overflow detected: body ${bodyWidth}px > viewport ${viewportWidth}px`);
  }
}

async function testCodeWorkspace(page: Page, width: number, height: number, label: string) {
  await setViewport(page, width, height);
  await navigateAndWait(page, '/practice/battle-arena/pair-sum');

  // Check no horizontal overflow
  await checkNoHorizontalOverflow(page);

  // Verify workspace loads - use specific selector for challenge title
  await expect(page.locator('.code-workspace-problem-header h2')).toContainText('Pair Sum');

  // Check problem panel exists
  const problemPanel = page.locator('.code-workspace-problem');
  await expect(problemPanel).toBeVisible();

  // Check editor panel exists
  const editorPanel = page.locator('.code-workspace-editor');
  await expect(editorPanel).toBeVisible();

  // Check tabs work
  const descriptionTab = page.locator('[role="tab"]:has-text("Description")');
  const examplesTab = page.locator('[role="tab"]:has-text("Examples")');
  const submissionsTab = page.locator('[role="tab"]:has-text("Submissions")');
  await expect(descriptionTab).toBeVisible();
  await expect(examplesTab).toBeVisible();
  await expect(submissionsTab).toBeVisible();

  // Test tab keyboard navigation
  await descriptionTab.focus();
  await page.keyboard.press('ArrowRight');
  await expect(examplesTab).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(submissionsTab).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(examplesTab).toBeFocused();

  // Check language selector
  const languageSelect = page.locator('.code-workspace-language-select select');
  await expect(languageSelect).toBeVisible();
  await languageSelect.selectOption('Python');
  await expect(page.locator('.arena-code-editor')).toContainText('def pair_sum');
  await languageSelect.selectOption('JavaScript');
  await expect(page.locator('.arena-code-editor')).toContainText('function pairSum');
  await languageSelect.selectOption('TypeScript');
  await expect(page.locator('.arena-code-editor')).toContainText('function pairSum(values: number[], target: number): number[]');

  // Check editor has content
  await expect(page.locator('.arena-code-editor')).toHaveValue(/function pairSum/);

  // Check terminal
  const terminal = page.locator('.code-workspace-terminal');
  await expect(terminal).toBeVisible();

  // Check terminal toggle
  const terminalToggle = page.locator('.code-workspace-terminal-toggle');
  await expect(terminalToggle).toBeVisible();

  // Check Run/Submit buttons
  await expect(page.locator('button:has-text("Run sample preview")')).toBeVisible();
  await expect(page.locator('button:has-text("Submit preview")')).toBeVisible();

  // Test Run preview
  await page.click('button:has-text("Run sample preview")');
  await expect(page.locator('.code-workspace-terminal-content .feature-status-notice')).toBeVisible();

  // Test Submit preview
  await page.click('button:has-text("Submit preview")');
  await expect(page.locator('.code-workspace-terminal-content .feature-status-notice')).toBeVisible();

  // Check copy starter button
  const copyButton = page.locator('button:has-text("Copy starter")');
  await expect(copyButton).toBeVisible();

  console.log(`${label} (${width}x${height}): PASS`);
}

test.describe('Phase 9 - Real Browser QA', () => {
  test('CodeWorkspace at 1440px - desktop split layout', async ({ page }) => {
    await testCodeWorkspace(page, 1440, 1000, '1440px desktop');
  });

  test('CodeWorkspace at 1024px - tablet/laptop stacked', async ({ page }) => {
    await setViewport(page, 1024, 1000);
    await navigateAndWait(page, '/practice/battle-arena/pair-sum');
    await checkNoHorizontalOverflow(page);

    // At 1024px should be stacked layout
    await expect(page.locator('.code-workspace-problem-header h2')).toContainText('Pair Sum');
    await expect(page.locator('.code-workspace-problem')).toBeVisible();
    await expect(page.locator('.code-workspace-editor')).toBeVisible();

    console.log('1024px stacked: PASS');
  });

  test('CodeWorkspace at 768px - tablet stacked', async ({ page }) => {
    await setViewport(page, 768, 1000);
    await navigateAndWait(page, '/practice/battle-arena/pair-sum');
    await checkNoHorizontalOverflow(page);

    await expect(page.locator('.code-workspace-problem-header h2')).toContainText('Pair Sum');
    await expect(page.locator('.code-workspace-problem')).toBeVisible();
    await expect(page.locator('.code-workspace-editor')).toBeVisible();

    console.log('768px tablet: PASS');
  });

  test('CodeWorkspace at 390px - mobile stacked', async ({ page }) => {
    await setViewport(page, 390, 800);
    await navigateAndWait(page, '/practice/battle-arena/pair-sum');
    await checkNoHorizontalOverflow(page);

    await expect(page.locator('.code-workspace-problem-header h2')).toContainText('Pair Sum');
    await expect(page.locator('.code-workspace-problem')).toBeVisible();
    await expect(page.locator('.code-workspace-editor')).toBeVisible();

    console.log('390px mobile: PASS');
  });

  test('Battle Arena listing page', async ({ page }) => {
    await setViewport(page, 1440, 1000);
    await navigateAndWait(page, '/practice/battle-arena');

    await expect(page.locator('h1')).toContainText('Battle Arena');
    await expect(page.locator('.arena-challenge-grid')).toBeVisible();

    // Test filters
    const searchInput = page.locator('input[aria-label="Search challenges"]');
    await expect(searchInput).toBeVisible();

    const difficultySelect = page.locator('select[aria-label="Filter by difficulty"]');
    await expect(difficultySelect).toBeVisible();
    await difficultySelect.selectOption('Easy');

    const topicSelect = page.locator('select[aria-label="Filter by topic"]');
    await expect(topicSelect).toBeVisible();

    const sortSelect = page.locator('select[aria-label="Sort challenges"]');
    await expect(sortSelect).toBeVisible();

    // Clear filters
    await page.click('button:has-text("Clear all")');

    // Test challenge card navigation - use the link inside the card
    const firstCardLink = page.locator('.arena-challenge-card .arena-card-footer a').first();
    await firstCardLink.click();
    await expect(page).toHaveURL(/\/practice\/battle-arena\/.+/);

    console.log('Battle Arena listing: PASS');
  });

  test('Battle Arena challenge workspace controls', async ({ page }) => {
    await setViewport(page, 1440, 1000);
    await navigateAndWait(page, '/practice/battle-arena/pair-sum');

    // Test tabs with keyboard
    const descTab = page.locator('[role="tab"]:has-text("Description")');
    await descTab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[role="tab"]:has-text("Examples")')).toBeFocused();

    // Test language selector
    await page.locator('.code-workspace-language-select select').selectOption('Python');
    await expect(page.locator('.arena-code-editor')).toContainText('def pair_sum');
    await page.locator('.code-workspace-language-select select').selectOption('TypeScript');

    // Test editor is editable
    const editor = page.locator('.arena-code-editor');
    await editor.fill('// test edit\nfunction pairSum(values: number[], target: number): number[] {\n  return [];\n}');
    await expect(editor).toHaveValue(/test edit/);

    // Test copy starter
    const copyBtn = page.locator('button:has-text("Copy starter")');
    await copyBtn.click();
    await expect(page.locator('.arena-copy-message')).toBeVisible();

    console.log('Challenge workspace controls: PASS');
  });

  test('Assignments listing', async ({ page }) => {
    await setViewport(page, 1440, 1000);
    await navigateAndWait(page, '/practice/assignments');

    await expect(page.locator('h1')).toContainText('Assignments');
    await expect(page.locator('.assignment-summary-grid')).toBeVisible();

    // Test search
    const searchInput = page.locator('input[aria-label="Search assignments"]');
    await expect(searchInput).toBeVisible();

    // Test filters
    const statusSelect = page.locator('select[aria-label="Filter assignments by status"]');
    await expect(statusSelect).toBeVisible();
    await statusSelect.selectOption('In Progress');

    const sortSelect = page.locator('select[aria-label="Sort assignments"]');
    await expect(sortSelect).toBeVisible();

    // Clear filters
    await page.click('button:has-text("Clear all")');

    // Test assignment card navigation - use the link inside the card
    const firstCardLink = page.locator('.assignment-card .feature-card-link').first();
    await firstCardLink.click();
    await expect(page).toHaveURL(/\/practice\/assignments\/.+/);

    console.log('Assignments listing: PASS');
  });

  test('Assignments detail and submission preview', async ({ page }) => {
    await setViewport(page, 1440, 1000);
    await navigateAndWait(page, '/practice/assignments/accessible-profile-card');

    await expect(page.locator('h1')).toContainText('Accessible Profile Card');

    // Test empty validation
    await page.click('button:has-text("Preview submission")');
    await expect(page.locator('.feature-field-error')).toBeVisible();

    // Test valid submission
    await page.locator('textarea[placeholder*="Describe your approach"]').fill('This is a test response that meets the minimum character requirement for the assignment submission preview.');
    await page.locator('input[placeholder*="https://example.com/project"]').fill('https://github.com/test/project');
    await page.click('button:has-text("Preview submission")');

    await expect(page.locator('.assignment-submission-preview')).toBeVisible();
    await expect(page.locator('.assignment-submission-preview')).toContainText('Nothing was submitted or saved');

    console.log('Assignments detail: PASS');
  });

  test('Dashboard and sidebar navigation', async ({ page }) => {
    await setViewport(page, 1440, 1000);
    await navigateAndWait(page, '/dashboard');

    // The dashboard page has two h1 elements - one in the top bar and one in the welcome section
    // Use the main content h1 which is "Welcome back, Developer" or the top bar h1
    await expect(page.locator('h1').first()).toContainText('Dashboard');

    // Test sidebar navigation - use more specific selectors
    const sidebarLinks = [
      { text: 'Hackathons', url: '/discover/hackathons' },
      { text: 'AI Team Matcher', url: '/discover/team-matcher' },
      { text: 'Skill Swap', url: '/discover/skill-swap' },
      { text: 'Mentors', url: '/discover/mentors' },
      { text: 'Teams', url: '/build/teams' },
      { text: 'Assignments', url: '/practice/assignments' },
      { text: 'Battle Arena', url: '/practice/battle-arena' },
      { text: 'AI Mentor', url: '/grow/ai-mentor' },
    ];

    for (const link of sidebarLinks) {
      await page.locator(`.dashboard-nav-link:has-text("${link.text}")`).first().click();
      await expect(page).toHaveURL(new RegExp(link.url.replace('/', '\\/') + '$'));
      await navigateAndWait(page, '/dashboard');
    }

    // Test logo link
    await page.locator('a[aria-label="DEV BYTE home"]').click();
    await expect(page).toHaveURL(BASE_URL + '/');

    console.log('Dashboard navigation: PASS');
  });

  test('Hackathons listing and detail', async ({ page }) => {
    await setViewport(page, 1440, 1000);
    await navigateAndWait(page, '/discover/hackathons');

    await expect(page.locator('h1')).toContainText('Hackathons');

    // Test search and filters
    const searchInput = page.locator('input[aria-label="Search hackathons"]');
    await expect(searchInput).toBeVisible();

    const categorySelect = page.locator('select[aria-label="Filter by category"]');
    await expect(categorySelect).toBeVisible();

    // Navigate to detail - use the first "View event brief" link
    await page.locator('a:has-text("View event brief")').first().click();
    await expect(page).toHaveURL(/\/discover\/hackathons\/.+/);
    // The first card is "Interface Sprint" based on the demo data order
    await expect(page.locator('h1')).toContainText('Interface Sprint');

    // Return to listing
    await page.locator('a:has-text("All hackathons")').click();
    await expect(page).toHaveURL(BASE_URL + '/discover/hackathons');

    console.log('Hackathons: PASS');
  });

test('Teams listing, creation, Team Matcher', async ({ page }) => {
    await setViewport(page, 1440, 1000);
    await navigateAndWait(page, '/build/teams');

    await expect(page.locator('h1')).toContainText('Find your people');

    // Test filters
    await page.locator('select[aria-label="Filter by interest"]').selectOption('Learning');
    await page.locator('button:has-text("Clear all")').click();

    // Navigate to team detail - use "View team" link
    await page.locator('a:has-text("View team")').first().click();
    await expect(page).toHaveURL(/\/build\/teams\/.+/);

    // Test Team Matcher
    await navigateAndWait(page, '/discover/team-matcher');
    await expect(page.locator('h1')).toContainText('Find a build rhythm');

    // Select preferences - use more specific selectors for each section
    // Skills I can contribute
    await page.locator('fieldset:has(legend:has-text("Skills I can contribute")) button:has-text("React")').click();
    await page.locator('fieldset:has(legend:has-text("Skills I can contribute")) button:has-text("TypeScript")').click();
    // Skills I want to learn
    await page.locator('fieldset:has(legend:has-text("Skills I want to learn")) button:has-text("Python")').click();
    // Preferred project domains
    await page.locator('fieldset:has(legend:has-text("Preferred project domains")) button:has-text("Learning tools")').click();
    // Preferred team roles
    await page.locator('fieldset:has(legend:has-text("Preferred team roles")) button:has-text("Frontend developer")').click();
    // Collaboration preferences
    await page.locator('fieldset:has(legend:has-text("Collaboration preferences")) button:has-text("Remote async")').click();

    // Explore sample profiles
    await page.click('button:has-text("Explore sample profiles")');
    await page.waitForTimeout(1500); // wait for animation
    // Verify we're on the results page (check for any content change)
    await expect(page.locator('h2:has-text("Potential collaboration styles")')).toBeVisible();

    // Edit preferences
    await page.click('button:has-text("Edit preferences")');
    await expect(page.locator('fieldset:has(legend:has-text("Skills I can contribute")) button:has-text("React")')).toHaveAttribute('aria-pressed', 'true');

    console.log('Teams and Team Matcher: PASS');
  });

  test('Skill Swap listing and request', async ({ page }) => {
    await setViewport(page, 1440, 1000);
    await navigateAndWait(page, '/discover/skill-swap');

    await expect(page.locator('h1')).toContainText('Skill Swap');

    // Test filters
    await page.locator('select[aria-label="Filter skill swap by category"]').selectOption('Web development');
    await page.locator('button:has-text("I can teach")').click();

    // Navigate to detail
    await page.locator('a:has-text("View exchange details")').first().click();
    await expect(page).toHaveURL(/\/discover\/skill-swap\/.+/);

    // Request preview
    await page.locator('a:has-text("Draft an exchange request")').click();
    await expect(page).toHaveURL(/\/request/);

    // Test validation
    await page.click('button:has-text("Preview exchange request")');
    await expect(page.locator('.feature-field-error').first()).toBeVisible();

    console.log('Skill Swap: PASS');
  });

test('Mentors listing, profile, booking', async ({ page }) => {
    await setViewport(page, 1440, 1000);
    await navigateAndWait(page, '/discover/mentors');

    await expect(page.locator('h1')).toContainText('Learn with a mentor');

    // Navigate to profile - use the "View mentor profile" link
    await page.locator('a:has-text("View mentor profile")').first().click();
    await expect(page).toHaveURL(/\/discover\/mentors\/.+/);

    // Book a session - use the first "Book a session" link in the profile
    await page.locator('a:has-text("Book a session")').first().click();
    await expect(page).toHaveURL(/\/book/);

    // Wait for booking form animation
    await page.waitForTimeout(1000);

    // Test booking form - session format is a select dropdown
    await page.locator('label:has-text("Session format") select').selectOption('30 minutes · Video call');
    await page.locator('label:has-text("Illustrative date") select').selectOption('Jun 15');
    await page.locator('button:has-text("10:00 AM")').click();
    await page.locator('textarea[placeholder*="goal"]').fill('Learn about accessible design patterns');
    await page.click('button:has-text("Review booking")');

    await expect(page.locator('text=Session summary preview')).toBeVisible();
    await page.click('button:has-text("Confirm booking")');
    await expect(page.locator('text=No session was booked')).toBeVisible();

    console.log('Mentors: PASS');
  });

  test('AI Mentor chat', async ({ page }) => {
    await setViewport(page, 1440, 1000);
    await navigateAndWait(page, '/grow/ai-mentor');

    await expect(page.locator('h1')).toContainText('AI Mentor');

    // Test suggested prompt - use actual prompt text
    await page.locator('button:has-text("Help me make a career plan")').click();
    await page.waitForTimeout(2500); // wait for animation and typing effect
    // Check for assistant message presence
    await expect(page.locator('[role="log"] .ai-chat-message').first()).toBeVisible();

    // Test custom prompt
    await page.locator('textarea[placeholder*="Write a prompt"]').fill('What is TypeScript?');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2500); // wait for animation and typing effect
    await expect(page.locator('[role="log"] .ai-chat-message').last()).toBeVisible();

    // Clear conversation
    await page.locator('button:has-text("Clear conversation")').click();
    await expect(page.locator('[role="log"] .ai-chat-message')).not.toBeVisible();

    console.log('AI Mentor: PASS');
  });

  test('Profile and Settings placeholders', async ({ page }) => {
    await navigateAndWait(page, '/profile');
    await expect(page.locator('text=Profile settings are not connected')).toBeVisible();

    await navigateAndWait(page, '/settings');
    await expect(page.locator('text=Account settings are not implemented')).toBeVisible();

    console.log('Profile/Settings: PASS');
  });

  test('Login placeholder', async ({ page }) => {
    await navigateAndWait(page, '/login');
    await expect(page.locator('text=Authentication is not connected')).toBeVisible();

    console.log('Login: PASS');
  });

  test('Unknown routes show 404', async ({ page }) => {
    await navigateAndWait(page, '/not-a-route');
    await expect(page.locator('text=Page not found')).toBeVisible();

    console.log('404: PASS');
  });

  test('Responsive - all pages at 390px', async ({ page }) => {
    await setViewport(page, 390, 800);

    const routes = [
      '/', '/signup', '/login', '/dashboard',
      '/discover/hackathons', '/discover/hackathons/interface-sprint',
      '/build/teams', '/build/teams/new',
      '/discover/team-matcher',
      '/discover/skill-swap', '/discover/skill-swap/react-python',
      '/practice/battle-arena', '/practice/battle-arena/pair-sum',
      '/practice/assignments', '/practice/assignments/accessible-profile-card',
      '/discover/mentors', '/discover/mentors/maya-chen', '/discover/mentors/maya-chen/book',
      '/grow/ai-mentor', '/profile', '/settings'
    ];

    for (const route of routes) {
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForLoadState('networkidle');
      await checkNoHorizontalOverflow(page);
      // Just verify page loads without horizontal overflow
      await expect(page.locator('body')).toBeVisible();
    }

    console.log('All routes at 390px: PASS');
  });

  test('Responsive - all pages at 768px', async ({ page }) => {
    await setViewport(page, 768, 1000);

    const routes = [
      '/', '/signup', '/login', '/dashboard',
      '/discover/hackathons', '/discover/hackathons/interface-sprint',
      '/build/teams', '/build/teams/new',
      '/discover/team-matcher',
      '/discover/skill-swap', '/discover/skill-swap/react-python',
      '/practice/battle-arena', '/practice/battle-arena/pair-sum',
      '/practice/assignments', '/practice/assignments/accessible-profile-card',
      '/discover/mentors', '/discover/mentors/maya-chen', '/discover/mentors/maya-chen/book',
      '/grow/ai-mentor', '/profile', '/settings'
    ];

    for (const route of routes) {
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForLoadState('networkidle');
      await checkNoHorizontalOverflow(page);
    }

    console.log('All routes at 768px: PASS');
  });

  test('Responsive - all pages at 1024px', async ({ page }) => {
    await setViewport(page, 1024, 1000);

    const routes = [
      '/', '/signup', '/login', '/dashboard',
      '/discover/hackathons', '/discover/hackathons/interface-sprint',
      '/build/teams', '/build/teams/new',
      '/discover/team-matcher',
      '/discover/skill-swap', '/discover/skill-swap/react-python',
      '/practice/battle-arena', '/practice/battle-arena/pair-sum',
      '/practice/assignments', '/practice/assignments/accessible-profile-card',
      '/discover/mentors', '/discover/mentors/maya-chen', '/discover/mentors/maya-chen/book',
      '/grow/ai-mentor', '/profile', '/settings'
    ];

    for (const route of routes) {
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForLoadState('networkidle');
      await checkNoHorizontalOverflow(page);
    }

    console.log('All routes at 1024px: PASS');
  });

  test('Responsive - all pages at 1440px', async ({ page }) => {
    await setViewport(page, 1440, 1000);

    const routes = [
      '/', '/signup', '/login', '/dashboard',
      '/discover/hackathons', '/discover/hackathons/interface-sprint',
      '/build/teams', '/build/teams/new',
      '/discover/team-matcher',
      '/discover/skill-swap', '/discover/skill-swap/react-python',
      '/practice/battle-arena', '/practice/battle-arena/pair-sum',
      '/practice/assignments', '/practice/assignments/accessible-profile-card',
      '/discover/mentors', '/discover/mentors/maya-chen', '/discover/mentors/maya-chen/book',
      '/grow/ai-mentor', '/profile', '/settings'
    ];

    for (const route of routes) {
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForLoadState('networkidle');
      await checkNoHorizontalOverflow(page);
    }

    console.log('All routes at 1440px: PASS');
  });
});