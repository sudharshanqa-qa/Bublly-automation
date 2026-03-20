# Contacts Screen Automation — Design Spec
**Date:** 2026-03-18
**Project:** bublly playwright automation (`/Users/sudharshan/Desktop/bublly playwright automation/`)
**Status:** Approved

---

## Overview

Add end-to-end Playwright automation for the Contacts screen in the bublly qa-desk app, following the exact same framework pattern used for Login, Dashboard, Inbox, and Boards screens.

---

## Files

### New Files

| File | Purpose |
|---|---|
| `ui/ContactsUI.ts` | All locators/selectors for the Contacts screen |
| `pages/ContactsPage.ts` | Page actions using ContactsUI |
| `tests/contacts.spec.ts` | **116 tests** (70 positive + 26 negative + 20 functional) |

### Modified Files

| File | Change |
|---|---|
| `utils/testdata.ts` | Add contacts-specific test data entries |

---

## Architecture

Follows the existing 3-layer Page Object Model:

```
tests/contacts.spec.ts
       ↓ uses
pages/ContactsPage.ts
       ↓ uses
ui/ContactsUI.ts
       ↓ uses
utils/testdata.ts  (shared)
```

---

## `ui/ContactsUI.ts`

All locators are `readonly Locator` properties initialized in the constructor, same pattern as `BoardsUI.ts`.

Exact selectors are confirmed during the DOM discovery step before writing this file.

| Group | Locators |
|---|---|
| Navigation | `contactsNavIcon` — sidebar nav icon to reach Contacts screen |
| Contact List | `contactListContainer`, `contactListItems`, `firstContactItem` |
| Contact Data | `contactNames`, `contactEmails`, `contactPhones` |
| Search | `searchInput` |
| Add Contact | `addContactButton` |
| Detail Panel | `detailPanelName`, `detailPanelEmail`, `detailPanelPhone`, `detailPanelTags`, `detailPanelTickets` |
| Shared | `bodyLocator` — `page.locator('body')`, used for negative/contamination checks |

---

## `pages/ContactsPage.ts`

**Import note:** The login import is `import { loginPage } from '../pages/loginPage'` (lowercase `l`) — this is the existing convention in the project.

| Method | Description |
|---|---|
| `navigateToContacts()` | Click sidebar nav icon, wait for contacts URL pattern (confirmed during DOM discovery), wait for contact list to be visible |
| `searchContact(keyword)` | Type into search input, wait for list to update |
| `clearSearch()` | Clear search input, wait for contact list to return to unfiltered state (at least one item visible) |
| `clickContact(index)` | Click contact at given index, wait for detail panel to be visible |
| `getContactCount()` | Return number of visible contact list items |
| `getContactNames()` | Return array of all visible contact name strings |
| `getFirstContactName()` | Return text of first contact name |
| `getDetailPanelName()` | Return name shown in the open detail panel |
| `getDetailPanelEmail()` | Return email shown in the open detail panel |
| `getDetailPanelPhone()` | Return phone shown in the open detail panel |
| `getDetailPanelTags()` | Return `Promise<string[]>` — array of tag strings shown in the open detail panel. Returns empty array `[]` when no tags are present (never `null`). |
| `getDetailPanelTickets()` | Return `Promise<number>` — numeric count of associated tickets shown in the open detail panel. Coerce DOM text to number inside this method. |
| `isDetailPanelVisible()` | Return boolean — whether the detail panel is currently visible |

---

## `tests/contacts.spec.ts`

**Test ID prefix:** `TC_CTT_`

**`beforeEach`:** Login using `loginPage` (lowercase) + navigate to contacts screen via `ContactsPage.navigateToContacts()`.

---

### Positive Tests (TC_CTT_001–070)

| ID Range | Scenario Group |
|---|---|
| TC_CTT_001–005 | Screen loads: URL matches, nav icon visible, list container visible, add button visible, search input visible |
| TC_CTT_006–015 | Contact list: at least one item, names are non-empty strings, emails shown, phones shown, count is a positive number, first item is visible, items are clickable |
| TC_CTT_016–025 | Search (valid): search input accepts text, searching keyword filters list, result count ≥ 1, result names match keyword, search clears correctly, full list restores after clear |
| TC_CTT_026–040 | Detail panel (open): clicking contact opens panel, panel is visible, panel shows name, panel shows email, panel shows phone, name matches list item clicked, panel fields are non-empty |
| TC_CTT_041–050 | Detail panel (tags & tickets): tags element is visible, tags count ≥ 0, tickets element is visible, ticket count is a number ≥ 0 |
| TC_CTT_051–060 | Navigation: nav icon is visible from other screens, contacts URL loads correctly, navigating away and back reloads list, page title/heading is visible |
| TC_CTT_061–070 | UI integrity: add contact button is visible, no error messages on load, body does not contain login form elements, body does not contain boards/tickets elements, contact list is scrollable if > N items |

---

### Negative Tests (TC_CTT_N001–N026)

| ID | Scenario |
|---|---|
| TC_CTT_N001 | Search gibberish keyword → shows empty state or "no results" message |
| TC_CTT_N002 | Search SQL injection (`' OR '1'='1`) → does not crash, list state is stable |
| TC_CTT_N003 | Search XSS payload (`<script>alert(1)</script>`) → does not execute script, list state is stable |
| TC_CTT_N004 | Search Unicode characters (`テスト検索`) → does not crash |
| TC_CTT_N005 | Search special characters (`!@#$%^&*()`) → does not crash |
| TC_CTT_N006 | Search 200+ character string → does not crash or break layout |
| TC_CTT_N007 | Search whitespace only → consistent behavior (no results or full list, not crash) |
| TC_CTT_N008 | Contact list does not show inbox/conversation elements |
| TC_CTT_N009 | Contact list does not show boards/tickets elements |
| TC_CTT_N010 | Contact list does not show login form elements |
| TC_CTT_N011 | Contact names in list are not empty strings |
| TC_CTT_N012 | Contact list count is not negative |
| TC_CTT_N013 | Detail panel does not open without clicking a contact |
| TC_CTT_N014 | `isDetailPanelVisible()` returns false before any contact is clicked |
| TC_CTT_N015 | Search result count does not exceed total contact count |
| TC_CTT_N016 | Invalid search does not open a detail panel automatically |
| TC_CTT_N017 | Search input does not auto-submit on focus |
| TC_CTT_N018 | Page does not show loading spinner indefinitely (resolves within timeout) |
| TC_CTT_N019 | Contact emails in detail panel are not empty for known contact |
| TC_CTT_N020 | Contact phone in detail panel is a non-empty string for a known contact |
| TC_CTT_N021 | Tag list in detail panel does not contain null/undefined entries |
| TC_CTT_N022 | Ticket count in detail panel is not negative |
| TC_CTT_N023 | Navigating to contacts URL directly (without sidebar click) loads the screen correctly |
| TC_CTT_N024 | Page body does not show a 404 or error page after navigation |
| TC_CTT_N025 | Search does not filter list when input is cleared |
| TC_CTT_N026 | Contact list does not show duplicate entries for the same contact name |

---

### Functional Tests (TC_CTT_F001–F020)

| ID | Scenario |
|---|---|
| TC_CTT_F001 | Search → verify list count drops → clear → verify count restores |
| TC_CTT_F002 | Search keyword → click first result → detail panel name matches searched keyword |
| TC_CTT_F003 | Open contact A → navigate away (to boards) → navigate back → contact list visible again |
| TC_CTT_F004 | Open contact → verify name, email, phone are all non-empty in one detail view |
| TC_CTT_F005 | Open contact → verify tags list renders |
| TC_CTT_F006 | Open contact → verify ticket count is a number |
| TC_CTT_F007 | Click contact at index 0 → detail panel visible → click contact at index 1 → detail panel updates |
| TC_CTT_F008 | Search → single result → click → detail panel matches that result |
| TC_CTT_F009 | Full page reload → contacts list re-renders with items |
| TC_CTT_F010 | Add contact button click → triggers expected UI response (modal, form, or route change) — **exact UI to be confirmed during DOM discovery before writing this test** |
| TC_CTT_F011 | Contact count before search ≥ contact count after valid search |
| TC_CTT_F012 | Contact count after clearing search equals contact count before search |
| TC_CTT_F013 | Contact list renders without horizontal overflow (layout integrity) |
| TC_CTT_F014 | Detail panel email is a valid email format (contains @) |
| TC_CTT_F015 | `getContactNames()` returns an array of length equal to `getContactCount()` |
| TC_CTT_F016 | First contact name in list matches `getFirstContactName()` return value |
| TC_CTT_F017 | `isDetailPanelVisible()` returns true after `clickContact(0)` |
| TC_CTT_F018 | Detail panel phone field value is non-empty for first contact |
| TC_CTT_F019 | Contacts nav icon navigates to contacts URL from the dashboard screen |
| TC_CTT_F020 | Search with `contactSearchKeyword` → result count is ≥ 1 |

---

## `utils/testdata.ts` Additions

```ts
// Contacts test data
contactSearchKeyword: "<real contact name from app — MUST be confirmed during DOM discovery before writing TC_CTT_F020 and TC_CTT_F002>",
contactInvalidSearch: "zzz_invalid_contact_xyz_999",
```

**Gate:** Do not write tests that depend on `contactSearchKeyword` until the live DOM discovery confirms a real contact name from the app. Replace the placeholder before those tests are written.

---

## Implementation Workflow

1. **DOM Discovery** — Open the Contacts screen in a live browser session. Confirm:
   - Exact URL pattern (e.g. `/contacts` or `/project/{uuid}/contacts`) — required for `navigateToContacts()` `waitForURL` call
   - Exact selectors for all locator groups
   - A real contact name for `contactSearchKeyword`
2. **`ui/ContactsUI.ts`** — Write with verified selectors + `bodyLocator`.
3. **`pages/ContactsPage.ts`** — Write all methods defined in the Methods table above.
4. **`utils/testdata.ts`** — Add contacts entries including the confirmed real contact name.
5. **`tests/contacts.spec.ts`** — Write all 116 tests following TC_CTT_ naming.
6. **Run & Fix** — Execute `npx playwright test tests/contacts.spec.ts`, fix selector or timing issues.

---

## Test Count Target

| Category | IDs | Count |
|---|---|---|
| Positive | TC_CTT_001–070 | 70 |
| Negative | TC_CTT_N001–N026 | 26 |
| Functional | TC_CTT_F001–F020 | 20 |
| **Total** | | **116** |

---

## Test File Structure

Single top-level `describe('Contacts', () => { ... })` block wrapping all 116 tests, matching the `describe('Boards', ...)` pattern in `boards.spec.ts`.

---

## Consistency Rules (match existing screens)

- `beforeEach`: login via `loginPage` (lowercase) + navigate to contacts screen
- Import: `import { loginPage } from '../pages/loginPage'` (note lowercase class name — existing convention)
- Use `waitFor({ state: 'visible' })` before assertions
- Use `toBeGreaterThanOrEqual(0)` where count may legitimately be zero
- `clearSearch()` must wait for list to return to unfiltered state before the method returns
- No `page.waitForTimeout` unless strictly necessary; prefer `waitFor` on locators
- `bodyLocator` used for cross-screen contamination checks in negative tests
