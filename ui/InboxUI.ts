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
        // The conversation list container: the div that directly wraps py-3 cursor-pointer rows.
        this.ticketListContainer = page.locator('div').filter({ has: page.locator('div[class*="cursor-pointer"][class*="py-3"]') }).first();
        // Conversation rows: py-3 cursor-pointer (sidebar channel items use py-2, so py-3 is unique to conversations)
        this.ticketItems = page.locator('div[class*="cursor-pointer"][class*="py-3"]');
        this.firstTicketItem = page.locator('div[class*="cursor-pointer"][class*="py-3"]').first();
        // Ticket ID spans appear inside the conversation detail panel (ml-3 spans with # prefix)
        this.ticketIdSpans = page.locator('span.ml-3').filter({ hasText: /^#/ });
        this.firstTicketIdSpan = page.locator('span.ml-3').filter({ hasText: /^#/ }).first();
        this.viewFilterButton = page.locator('button').filter({ hasText: /^\d*(Open|All|Pending|Resolved|Closed)$/ }).first();
        this.listHeadingAll = page.locator('p.font-semibold:has-text("All")').first();

        // ── Detail Panel tabs ─────────────────────────────────────────────────
        // These buttons have no aria role attribute — use filter by text instead of getByRole
        this.detailsTab = page.locator('button').filter({ hasText: /^Details$/ }).first();
        this.descriptionTab = page.locator('button').filter({ hasText: /^Description$/ }).first();
        this.aiBriefTab = page.locator('button').filter({ hasText: /^AI Brief$/ }).first();

        // ── Detail Panel ──────────────────────────────────────────────────────
        this.detailPanelContainer = page.locator('//div[contains(@class,"flex-1") and not(contains(@class,"sidebar"))]').last();
        this.ticketSubjectHeader = page.locator('h1, h2, h3').first();
        this.ticketIdInDetail = page.locator('span[class*="text-grey-text"]:has-text("#TESAFD"), span[class*="ml-3"]:has-text("#TESAFD")').first();
        this.messageThread = page.locator('//div[contains(@class,"overflow-y-auto")]').last();
        this.messageBubbles = page.locator('[class*="message"], [class*="bubble"], [class*="chat"]');
        this.replyEditor = page.locator('div[contenteditable="true"]').last();
        // Send button: appears after typing, has class bg-primary-button
        this.sendButton = page.locator('button[class*="bg-primary-button"]');
        // These buttons have no aria role attribute — use filter by text instead of getByRole
        this.summarizeButton = page.locator('button').filter({ hasText: /^Summarize$/ }).first();
        this.aiSuggestionsButton = page.locator('button').filter({ hasText: /^Bub AI Suggestions$/ }).first();
        this.detailPanelHeader = page.locator('//div[contains(@class,"border-b")]').first();

        // ── Metadata Sidebar ──────────────────────────────────────────────────
        // Metadata panel class: "space-y-3 text-sm text-gray-800 dark:... p-2 bg-grey-100"
        const metaPanel = page.locator('div[class*="space-y-3"][class*="bg-grey"]').first();
        this.metadataPanel = metaPanel;
        this.statusOptions = page.locator('[role="option"]');
        this.priorityOptions = page.locator('[role="option"]');
        // data-[placeholder] combobox buttons within metadata, in DOM order:
        // 0=assignee, 1=queue(Customer Support), 2=type(Inbox), 3=status(Open), 4=priority(Medium)
        // "Queue" label does not exist in DOM — use positional selectors scoped to metaPanel
        this.assigneeDropdown = metaPanel.locator('button[class*="data-[placeholder]"]').nth(0);
        this.queueDropdown    = metaPanel.locator('button[class*="data-[placeholder]"]').nth(1);
        this.typeDropdown     = metaPanel.locator('button[class*="data-[placeholder]"]').nth(2);
        this.statusDropdown   = metaPanel.locator('button[class*="data-[placeholder]"]').nth(3);
        this.priorityDropdown = metaPanel.locator('button[class*="data-[placeholder]"]').nth(4);

        // ── Shared / Navigation ────────────────────────────────────────────────
        this.inboxSidebarLogo = page.locator('img[alt="bubllyIcon"]').first();
        this.dashboardNavIcon = page.locator("xpath=(//div[contains(@class,'relative p-2')]//*[name()='svg'])[1]");
        this.bodyLocator = page.locator('body');
    }
}
