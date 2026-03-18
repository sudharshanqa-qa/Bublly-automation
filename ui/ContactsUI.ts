import { Page, Locator } from '@playwright/test';

export class ContactsUI {

    // ── Navigation ────────────────────────────────────────────────────────────
    readonly contactsNavIcon: Locator;        // bottom sidebar grid — first div in gap-1.5 py-5 container

    // ── Contact List (real HTML table) ────────────────────────────────────────
    readonly contactListContainer: Locator;   // <table> element wrapping all contacts
    readonly contactListItems: Locator;       // <tbody tr> rows — one per contact
    readonly firstContactItem: Locator;       // first <tbody tr> row
    readonly contactNames: Locator;           // <a> links inside tbody td cells
    readonly contactEmails: Locator;          // span inside second td of each row

    // ── Search (two-step: click icon first, then type) ────────────────────────
    readonly searchIconButton: Locator;       // p-2 hover:bg-gray-100 button that reveals input
    readonly searchInput: Locator;            // input[placeholder="Search by email or name..."] (visible after icon click)

    // ── Actions ───────────────────────────────────────────────────────────────
    readonly addContactButton: Locator;       // "Add Contact" button in header

    // ── Detail Panel (separate page: /contacts/users/{id}) ───────────────────
    readonly detailPanelContainer: Locator;   // space-y-5 bg-white container on detail page
    readonly detailPanelName: Locator;        // .group nth(0) — name field value
    readonly detailPanelEmail: Locator;       // .group nth(1) — email field value
    readonly detailPanelLocation: Locator;    // .group nth(5) — location field (no phone field exists)
    readonly detailPanelActivities: Locator;  // li.flex.gap-x-4 items — activity list (maps to tags/activities)
    readonly detailPanelConversations: Locator; // hover:bg-gray-50 buttons — conversation timeline (maps to tickets)

    // ── Shared ────────────────────────────────────────────────────────────────
    readonly bodyLocator: Locator;

    constructor(page: Page) {

        // ── Navigation ────────────────────────────────────────────────────────
        this.contactsNavIcon = page.locator('div[class*="gap-1.5"][class*="py-5"] > div').first();

        // ── Contact List ──────────────────────────────────────────────────────
        this.contactListContainer = page.locator('table');
        this.contactListItems = page.locator('tbody tr');
        this.firstContactItem = page.locator('tbody tr').first();
        // Contact names are <a> links inside tbody td cells
        this.contactNames = page.locator('tbody tr td a');
        // Emails are in a span inside the second td of each row
        this.contactEmails = page.locator('tbody tr td:nth-child(2) span');

        // ── Search ────────────────────────────────────────────────────────────
        // Two-step search: click the icon first, then the input becomes visible
        this.searchIconButton = page.locator('button[class*="p-2"][class*="hover:bg-gray-100"]').first();
        this.searchInput = page.locator('input[placeholder="Search by email or name..."]');

        // ── Actions ───────────────────────────────────────────────────────────
        this.addContactButton = page.getByRole('button', { name: /Add Contact/ });

        // ── Detail Panel (/contacts/users/{id}) ───────────────────────────────
        this.detailPanelContainer = page.locator('div[class*="space-y-5"][class*="bg-white"]');
        // Field rows are .group elements; name is index 0, email is index 1
        this.detailPanelName = page.locator('.group').nth(0).locator('div[class*="text-primary-gray-800"]');
        this.detailPanelEmail = page.locator('.group').nth(1).locator('div[class*="text-primary-gray-800"]');
        // No phone field exists — Location (index 5) serves as the extra detail field
        this.detailPanelLocation = page.locator('.group').nth(5).locator('div[class*="text-primary-gray-800"]');
        // Activity list items map to tags/activities concept
        this.detailPanelActivities = page.locator('li[class*="flex"][class*="gap-x-4"]');
        // Conversation timeline buttons map to tickets/conversations concept
        this.detailPanelConversations = page.locator('button[class*="hover:bg-gray-50"]');

        // ── Shared ────────────────────────────────────────────────────────────
        this.bodyLocator = page.locator('body');
    }
}
