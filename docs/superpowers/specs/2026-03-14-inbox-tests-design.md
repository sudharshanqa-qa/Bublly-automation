# Inbox Test Suite Design

**Date:** 2026-03-14
**Project:** Bublly Playwright Automation
**Feature:** Inbox page test coverage

---

## Overview

Comprehensive Playwright test suite for the Inbox page, following the existing Page Object Model (POM) pattern used by Login and Dashboard specs. Targets ~85 test cases covering all inbox areas.

---

## Architecture

Three new files mirroring the Dashboard pattern:

| File | Purpose |
|---|---|
| `ui/InboxUI.ts` | All Locators for inbox page elements |
| `pages/InboxPage.ts` | Action methods (navigate, interact, assert helpers) |
| `tests/inbox.spec.ts` | All test cases |

**beforeEach:** Login with `testdata.email` / `testdata.password`, navigate to dashboard, open first ticket to land on `/inbox`.

---

## File Responsibilities

### `ui/InboxUI.ts`
Locators grouped by panel:
- **List panel** (left): ticket list container, individual ticket items, ticket ID, customer name, status badge, unread indicator, search input, filter tabs (All / Open / Pending / Resolved / Closed), ticket count label, sort button
- **Detail panel** (right): subject/title header, message thread container, reply editor (`[contenteditable]` or `textarea`), send button, attachment button, metadata panel, status dropdown, priority dropdown, assignee field, tags field, ticket ID in header
- **Shared**: page URL check, back/navigation controls, sidebar

### `pages/InboxPage.ts`
Action methods:
- `navigateToInbox()` — open first ticket from dashboard
- `openTicketByIndex(n)` — click nth ticket in list
- `searchInbox(keyword)` — fill search input and press Enter
- `clearSearch()` — clear search field
- `clickFilterTab(tabName)` — click All / Open / Pending etc.
- `typeReply(text)` — fill reply editor
- `clickSend()` — click send button
- `openStatusDropdown()` — click status field in metadata
- `selectStatus(status)` — pick a status option
- `openPriorityDropdown()` — click priority field
- `selectPriority(priority)` — pick a priority option
- `getTicketListCount()` — count visible ticket rows

### `tests/inbox.spec.ts`
~85 test cases in sections:
1. Positive (TC_INB_001–055)
2. Negative (TC_INB_N001–N020)
3. Functional Flows (TC_INB_F001–F010)

---

## Test Case Breakdown

### Positive Cases (TC_INB_001–055)
- Page loads and URL contains `/inbox`
- Conversation list panel is visible
- Detail panel is visible after ticket click
- Ticket list shows ticket ID, customer name
- Status badge visible on ticket list items
- Priority badge visible on ticket list items
- Unread ticket has visual indicator
- Subject/title shown in detail header
- Message thread container is visible
- Reply editor is visible and editable
- Send button is visible in reply editor
- Attachment button is visible
- Metadata panel is visible
- Status field in metadata is visible and interactive
- Priority field in metadata is visible and interactive
- Assignee field is visible in metadata
- Tags field is visible in metadata
- Filter tab "All" is visible and active by default
- Filter tabs Open / Pending / Resolved / Closed are visible
- Clicking filter tab updates the list
- Search bar is visible in inbox
- Search bar accepts text input
- Searching a valid keyword filters the list
- Ticket count label is visible
- Clicking a different ticket in list loads its detail
- Ticket ID shown in detail panel header
- Reply editor accepts typed text
- Send button enabled when reply has content
- Sidebar navigation elements visible in inbox
- Logo visible in inbox sidebar
- Back navigation from inbox does not crash
- Inbox page title is non-empty
- Sort button visible in ticket list
- Clicking sort keeps user on inbox
- Multiple tickets visible in list
- Scrolling the ticket list is possible
- Metadata panel fields are non-empty for an open ticket
- Status dropdown shows multiple options when opened
- Priority dropdown shows multiple options when opened
- Ticket subject is non-empty in detail header
- Customer name is non-empty in ticket list
- Reply editor placeholder text is visible
- Attachment button is clickable without error
- Inbox retains state after switching tabs and back
- Filter tab click keeps user on inbox URL
- Ticket list container is scrollable
- Message bubble(s) visible in thread for opened ticket
- Inbox page does not redirect to login
- Detail panel closes/changes on selecting another ticket
- Send button is visible and of correct role

### Negative Cases (TC_INB_N001–N020)
- Search with invalid keyword shows no results message
- Search with special characters stays stable
- Search with whitespace-only stays stable
- Search with SQL injection string is handled safely
- Search with XSS payload is handled safely
- Search with very long string stays stable
- Reply editor empty — send button disabled or submit does nothing
- Rapid filter tab switching stays stable
- Rapid ticket open/close stays stable
- Navigating back from inbox does not redirect to login
- Direct inbox URL access without login shows login form
- Unicode characters in search are handled safely
- Numeric-only search stays stable
- Rapid clicking send without text stays stable
- Closing and reopening the same ticket stays stable

### Functional Flows (TC_INB_F001–F010)
- F001: Open ticket → read thread → type reply → verify send button enabled
- F002: Open ticket → open status dropdown → select status → verify metadata updates
- F003: Open ticket → open priority dropdown → select priority → verify metadata updates
- F004: Search inbox → find ticket → open → verify detail panel loads
- F005: Filter by Open tab → list updates → open ticket → verify it's open status
- F006: Filter by Resolved → list updates → stays on inbox
- F007: Full search flow: type → results appear → clear → all tickets return
- F008: Ticket navigation flow: open ticket 1 → open ticket 2 → detail panel changes
- F009: Reply flow: open ticket → type reply → verify send button state
- F010: Sidebar navigation flow: inbox → click dashboard icon → lands on dashboard

---

## Locator Strategy

- Prefer `getByRole`, `getByText`, `locator()` with semantic attributes
- Inbox list panel scoped to left column: `locator('.inbox-list, [data-testid="ticket-list"]')` or structural selectors
- Detail panel scoped to right column
- Reply editor: `[contenteditable="true"]` or `textarea` inside reply area
- Dropdowns: `[role="combobox"]`, `[role="listbox"]`, `[role="option"]`
- Filter tabs: `[role="tab"]` or `button` elements in the tab bar
- Ticket items: `table tbody tr` or list item selectors depending on DOM

---

## Naming Conventions

Follows existing convention:
- `TC_INB_001` — positive
- `TC_INB_N001` — negative
- `TC_INB_F001` — functional flow

---

## Dependencies

- Reuses `loginPage` and `testdata` from existing utils
- `DashboardPage.openFirstTicket()` used in `beforeEach` to reach inbox
