import { Page, Locator } from '@playwright/test';

export class BoardsUI {

    // ── Navigation ────────────────────────────────────────────────────────────
    readonly boardsNavIcon: Locator;       // #tour-step-boards inner clickable element

    // ── Sidebar ───────────────────────────────────────────────────────────────
    readonly sidebarHeading: Locator;      // "Tickets" heading in left sidebar
    readonly boardListContainer: Locator;  // grid container holding all board items
    readonly boardListItems: Locator;      // individual board items (flex gap-2 cursor-pointer)
    readonly firstBoardItem: Locator;
    readonly addBoardIcon: Locator;        // Add Board icon (SVG, no text label)

    // ── Board Header ──────────────────────────────────────────────────────────
    readonly boardTitle: Locator;          // board name p element in main panel header

    // ── Kanban Columns ────────────────────────────────────────────────────────
    readonly openColumnHeader: Locator;    // "Open" column header p
    readonly doneColumnHeader: Locator;    // "Done" column header p
    readonly openColumnCount: Locator;     // count badge div next to "Open"
    readonly doneColumnCount: Locator;     // count badge div next to "Done"

    // ── Ticket Cards ──────────────────────────────────────────────────────────
    // Ticket cards are <div role="button" class="...cursor-grab...">
    readonly ticketCards: Locator;
    readonly firstTicketCard: Locator;
    readonly ticketIdBadges: Locator;      // p elements with TESAFD_ prefix
    readonly firstTicketIdBadge: Locator;
    readonly priorityBadges: Locator;      // p elements with priority text (class text-primary-warning-800)

    // ── Shared ────────────────────────────────────────────────────────────────
    readonly bodyLocator: Locator;

    constructor(page: Page) {

        // ── Navigation ────────────────────────────────────────────────────────
        this.boardsNavIcon = page.locator('#tour-step-boards [data-state]').first();

        // ── Sidebar ───────────────────────────────────────────────────────────
        this.sidebarHeading = page.locator('p').filter({ hasText: /^Tickets$/ }).first();
        // Board list container: div with grid grid-cols-1 gap-2 cursor-pointer
        this.boardListContainer = page.locator('div[class*="grid-cols-1"][class*="gap-2"][class*="cursor-pointer"]').first();
        // Individual board items: flex gap-2 items-center-safe justify-between cursor-pointer p-2
        this.boardListItems = page.locator('div[class*="flex gap-2 items-center-safe justify-between"][class*="cursor-pointer"]');
        this.firstBoardItem = page.locator('div[class*="flex gap-2 items-center-safe justify-between"][class*="cursor-pointer"]').first();
        // Add board is an icon button (SVG), no text — absolute positioned div at bottom of list
        this.addBoardIcon = page.locator('div[class*="absolute"][class*="bottom-5"][class*="rounded-3xl"]').first();

        // ── Board Header ──────────────────────────────────────────────────────
        this.boardTitle = page.locator('p[class*="font-semibold"]').first();

        // ── Kanban Columns ────────────────────────────────────────────────────
        this.openColumnHeader = page.locator('p').filter({ hasText: /^Open$/ }).first();
        this.doneColumnHeader = page.locator('p').filter({ hasText: /^Done$/ }).first();
        // Count badges: div.w-5.h-5.rounded-full containing the number
        this.openColumnCount = page.locator('div[class*="w-5"][class*="h-5"][class*="rounded-full"]').first();
        this.doneColumnCount = page.locator('div[class*="w-5"][class*="h-5"][class*="rounded-full"]').nth(1);

        // ── Ticket Cards ──────────────────────────────────────────────────────
        // Cards are <div role="button" class="...cursor-grab...">
        this.ticketCards = page.locator('div[role="button"][class*="cursor-grab"]');
        this.firstTicketCard = page.locator('div[role="button"][class*="cursor-grab"]').first();
        this.ticketIdBadges = page.locator('p').filter({ hasText: /TESAFD_/ });
        this.firstTicketIdBadge = page.locator('p').filter({ hasText: /TESAFD_/ }).first();
        // Priority p elements have class text-primary-warning-800
        this.priorityBadges = page.locator('p[class*="text-primary-warning-800"]');

        // ── Shared ────────────────────────────────────────────────────────────
        this.bodyLocator = page.locator('body');
    }
}
