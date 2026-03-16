import { Page, Locator } from '@playwright/test';

export class InboxUI {

    // ── List Panel (left column) ─────────────────────────────────────────────
    readonly ticketListContainer: Locator;
    readonly ticketItems: Locator;       // clickable <a> ticket links
    readonly firstTicketItem: Locator;
    readonly ticketIdSpans: Locator;     // span.ellipsOne — ticket ID text visible in list
    readonly firstTicketIdSpan: Locator;
    readonly viewFilterButton: Locator;  // "1Open" / "All" combobox in left panel header
    readonly listHeadingAll: Locator;    // "All" heading shown in left panel

    // ── Detail Panel tabs ────────────────────────────────────────────────────
    readonly detailsTab: Locator;
    readonly descriptionTab: Locator;
    readonly aiBriefTab: Locator;

    // ── Detail Panel (right column) ──────────────────────────────────────────
    readonly detailPanelContainer: Locator;
    readonly ticketSubjectHeader: Locator;
    readonly ticketIdInDetail: Locator;
    readonly messageThread: Locator;
    readonly messageBubbles: Locator;
    readonly replyEditor: Locator;       // div[contenteditable="true"] — placeholder "Start Conversation..."
    readonly sendButton: Locator;        // icon-only submit button (p-2 class) in reply toolbar
    readonly summarizeButton: Locator;
    readonly aiSuggestionsButton: Locator;
    readonly detailPanelHeader: Locator;

    // ── Metadata Sidebar ─────────────────────────────────────────────────────
    readonly metadataPanel: Locator;
    readonly statusDropdown: Locator;    // button showing current status e.g. "Open"
    readonly statusOptions: Locator;
    readonly priorityDropdown: Locator;  // button showing current priority e.g. "Medium"
    readonly priorityOptions: Locator;
    readonly assigneeDropdown: Locator;
    readonly queueDropdown: Locator;
    readonly typeDropdown: Locator;

    // ── Shared / Navigation ──────────────────────────────────────────────────
    readonly inboxSidebarLogo: Locator;
    readonly dashboardNavIcon: Locator;
    readonly bodyLocator: Locator;

    constructor(page: Page) {

        // ── List Panel ────────────────────────────────────────────────────────
        this.ticketListContainer = page.locator('//div[contains(@class,"overflow-y-auto")]').first();
        this.ticketItems = page.locator('a[href*="/ticket/"]');
        this.firstTicketItem = page.locator('a[href*="/ticket/"]').first();
        this.ticketIdSpans = page.locator('span.ml-3');
        this.firstTicketIdSpan = page.locator('span.ml-3').first();
        this.viewFilterButton = page.locator('button').filter({ hasText: /^\d*(Open|All|Pending|Resolved|Closed)$/ }).first();
        this.listHeadingAll = page.locator('p.font-semibold:has-text("All")').first();

        // ── Detail Panel tabs ─────────────────────────────────────────────────
        this.detailsTab = page.getByRole('button', { name: 'Details' });
        this.descriptionTab = page.getByRole('button', { name: 'Description' });
        this.aiBriefTab = page.getByRole('button', { name: 'AI Brief' });

        // ── Detail Panel ──────────────────────────────────────────────────────
        this.detailPanelContainer = page.locator('//div[contains(@class,"flex-1") and not(contains(@class,"sidebar"))]').last();
        this.ticketSubjectHeader = page.locator('h1, h2, h3').first();
        this.ticketIdInDetail = page.locator('span[class*="text-grey-text"]:has-text("#TESAFD"), span[class*="ml-3"]:has-text("#TESAFD")').first();
        this.messageThread = page.locator('//div[contains(@class,"overflow-y-auto")]').last();
        this.messageBubbles = page.locator('[class*="message"], [class*="bubble"], [class*="chat"]');
        this.replyEditor = page.locator('div[contenteditable="true"]').last();
        // Send button: appears after typing, has class bg-primary-button
        this.sendButton = page.locator('button[class*="bg-primary-button"]');
        this.summarizeButton = page.getByRole('button', { name: 'Summarize' });
        this.aiSuggestionsButton = page.getByRole('button', { name: 'Bub AI Suggestions' });
        this.detailPanelHeader = page.locator('//div[contains(@class,"border-b")]').first();

        // ── Metadata Sidebar ──────────────────────────────────────────────────
        this.metadataPanel = page.locator('div:has(div[class="grid "]:has-text("Status"))').last();
        // Status/priority/assignee are combobox-style buttons sharing the same class pattern
        // Ordered in DOM: project button → "1Open" view filter → then metadata: status, priority, assignee, queue, type
        this.statusDropdown = page.locator('button[class*="data-[placeholder]"]').nth(3);   // 0=project,1=viewFilter,2=?,3=status
        this.statusOptions = page.locator('[role="option"]');
        this.priorityDropdown = page.locator('button[class*="data-[placeholder]"]').nth(4);  // priority after status
        this.priorityOptions = page.locator('[role="option"]');
        this.assigneeDropdown = page.locator('button[class*="data-[placeholder]"]').nth(2);  // assignee
        this.queueDropdown = page.locator('button').filter({ hasText: /customer support/i }).first();
        this.typeDropdown = page.locator('button').filter({ hasText: /^Inbox$/ }).first();

        // ── Shared / Navigation ────────────────────────────────────────────────
        this.inboxSidebarLogo = page.locator('img[alt="bubllyIcon"]').first();
        this.dashboardNavIcon = page.locator("(//div[contains(@class,'relative p-2')]//*[name()='svg'])[1]");
        this.bodyLocator = page.locator('body');
    }
}
