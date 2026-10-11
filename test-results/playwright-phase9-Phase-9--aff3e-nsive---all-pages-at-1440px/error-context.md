# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: playwright-phase9.spec.ts >> Phase 9 - Real Browser QA >> Responsive - all pages at 1440px
- Location: playwright-phase9.spec.ts:534:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

```

# Test source

```ts
  450 |     console.log('Login: PASS');
  451 |   });
  452 | 
  453 |   test('Unknown routes show 404', async ({ page }) => {
  454 |     await navigateAndWait(page, '/not-a-route');
  455 |     await expect(page.locator('text=Page not found')).toBeVisible();
  456 | 
  457 |     console.log('404: PASS');
  458 |   });
  459 | 
  460 |   test('Responsive - all pages at 390px', async ({ page }) => {
  461 |     await setViewport(page, 390, 800);
  462 | 
  463 |     const routes = [
  464 |       '/', '/signup', '/login', '/dashboard',
  465 |       '/discover/hackathons', '/discover/hackathons/interface-sprint',
  466 |       '/build/teams', '/build/teams/new',
  467 |       '/discover/team-matcher',
  468 |       '/discover/skill-swap', '/discover/skill-swap/react-python',
  469 |       '/practice/battle-arena', '/practice/battle-arena/pair-sum',
  470 |       '/practice/assignments', '/practice/assignments/accessible-profile-card',
  471 |       '/discover/mentors', '/discover/mentors/maya-chen', '/discover/mentors/maya-chen/book',
  472 |       '/grow/ai-mentor', '/profile', '/settings'
  473 |     ];
  474 | 
  475 |     for (const route of routes) {
  476 |       await page.goto(`${BASE_URL}${route}`);
  477 |       await page.waitForLoadState('networkidle');
  478 |       await checkNoHorizontalOverflow(page);
  479 |       // Just verify page loads without horizontal overflow
  480 |       await expect(page.locator('body')).toBeVisible();
  481 |     }
  482 | 
  483 |     console.log('All routes at 390px: PASS');
  484 |   });
  485 | 
  486 |   test('Responsive - all pages at 768px', async ({ page }) => {
  487 |     await setViewport(page, 768, 1000);
  488 | 
  489 |     const routes = [
  490 |       '/', '/signup', '/login', '/dashboard',
  491 |       '/discover/hackathons', '/discover/hackathons/interface-sprint',
  492 |       '/build/teams', '/build/teams/new',
  493 |       '/discover/team-matcher',
  494 |       '/discover/skill-swap', '/discover/skill-swap/react-python',
  495 |       '/practice/battle-arena', '/practice/battle-arena/pair-sum',
  496 |       '/practice/assignments', '/practice/assignments/accessible-profile-card',
  497 |       '/discover/mentors', '/discover/mentors/maya-chen', '/discover/mentors/maya-chen/book',
  498 |       '/grow/ai-mentor', '/profile', '/settings'
  499 |     ];
  500 | 
  501 |     for (const route of routes) {
  502 |       await page.goto(`${BASE_URL}${route}`);
  503 |       await page.waitForLoadState('networkidle');
  504 |       await checkNoHorizontalOverflow(page);
  505 |     }
  506 | 
  507 |     console.log('All routes at 768px: PASS');
  508 |   });
  509 | 
  510 |   test('Responsive - all pages at 1024px', async ({ page }) => {
  511 |     await setViewport(page, 1024, 1000);
  512 | 
  513 |     const routes = [
  514 |       '/', '/signup', '/login', '/dashboard',
  515 |       '/discover/hackathons', '/discover/hackathons/interface-sprint',
  516 |       '/build/teams', '/build/teams/new',
  517 |       '/discover/team-matcher',
  518 |       '/discover/skill-swap', '/discover/skill-swap/react-python',
  519 |       '/practice/battle-arena', '/practice/battle-arena/pair-sum',
  520 |       '/practice/assignments', '/practice/assignments/accessible-profile-card',
  521 |       '/discover/mentors', '/discover/mentors/maya-chen', '/discover/mentors/maya-chen/book',
  522 |       '/grow/ai-mentor', '/profile', '/settings'
  523 |     ];
  524 | 
  525 |     for (const route of routes) {
  526 |       await page.goto(`${BASE_URL}${route}`);
  527 |       await page.waitForLoadState('networkidle');
  528 |       await checkNoHorizontalOverflow(page);
  529 |     }
  530 | 
  531 |     console.log('All routes at 1024px: PASS');
  532 |   });
  533 | 
  534 |   test('Responsive - all pages at 1440px', async ({ page }) => {
  535 |     await setViewport(page, 1440, 1000);
  536 | 
  537 |     const routes = [
  538 |       '/', '/signup', '/login', '/dashboard',
  539 |       '/discover/hackathons', '/discover/hackathons/interface-sprint',
  540 |       '/build/teams', '/build/teams/new',
  541 |       '/discover/team-matcher',
  542 |       '/discover/skill-swap', '/discover/skill-swap/react-python',
  543 |       '/practice/battle-arena', '/practice/battle-arena/pair-sum',
  544 |       '/practice/assignments', '/practice/assignments/accessible-profile-card',
  545 |       '/discover/mentors', '/discover/mentors/maya-chen', '/discover/mentors/maya-chen/book',
  546 |       '/grow/ai-mentor', '/profile', '/settings'
  547 |     ];
  548 | 
  549 |     for (const route of routes) {
> 550 |       await page.goto(`${BASE_URL}${route}`);
      |                  ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
  551 |       await page.waitForLoadState('networkidle');
  552 |       await checkNoHorizontalOverflow(page);
  553 |     }
  554 | 
  555 |     console.log('All routes at 1440px: PASS');
  556 |   });
  557 | });
```