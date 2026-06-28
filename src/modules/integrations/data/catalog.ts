import type { Integration } from "../types";

export const INTEGRATIONS: Integration[] = [
  /* ── Communication ────────────────────────────────────────────────────── */
  {
    id: "gmail", name: "Gmail", category: "communication",
    icon: "📧", color: "from-red-500/30 to-red-600/10", iconBg: "bg-red-500/20",
    authType: "oauth", popular: true,
    description: "Send emails, read messages, and automate your inbox.",
    longDesc: "Connect Gmail to let your AI employees send personalized emails, respond to inquiries, and trigger workflows from new messages.",
    features: ["Send emails from AI employees", "Read and process incoming emails", "Trigger workflows on new messages", "Manage labels and threads"],
    authFields: [{ key: "client_id", label: "Google Client ID", type: "text", placeholder: "Your OAuth Client ID", required: true }],
  },
  {
    id: "outlook", name: "Outlook", category: "communication",
    icon: "📩", color: "from-blue-500/30 to-blue-600/10", iconBg: "bg-blue-500/20",
    authType: "oauth",
    description: "Microsoft Outlook and Office 365 email integration.",
    longDesc: "Integrate Outlook to automate email responses, manage calendars, and connect with the Microsoft 365 ecosystem.",
    features: ["Send and receive emails", "Calendar access", "Teams notifications", "OneDrive file access"],
    authFields: [{ key: "tenant_id", label: "Azure Tenant ID", type: "text", placeholder: "your-tenant-id", required: true }],
  },
  {
    id: "slack", name: "Slack", category: "communication",
    icon: "💬", color: "from-violet-500/30 to-violet-600/10", iconBg: "bg-violet-500/20",
    authType: "webhook", popular: true,
    description: "Post AI responses to Slack channels and DMs.",
    longDesc: "Send workflow outputs, alerts, and AI-generated summaries directly to Slack channels. Trigger automations from Slack commands.",
    features: ["Post messages to channels", "Send DMs to users", "Receive slash commands", "Post rich blocks and attachments"],
    authFields: [
      { key: "webhook_url", label: "Incoming Webhook URL", type: "url", placeholder: "https://hooks.slack.com/services/…", required: true },
      { key: "default_channel", label: "Default Channel", type: "text", placeholder: "#general", required: false },
    ],
  },
  {
    id: "discord", name: "Discord", category: "communication",
    icon: "🎮", color: "from-indigo-500/30 to-indigo-600/10", iconBg: "bg-indigo-500/20",
    authType: "webhook",
    description: "Send notifications and messages to Discord servers.",
    longDesc: "Integrate Discord to post AI-generated updates, alerts, and customer messages to your Discord community or team server.",
    features: ["Post to channels via webhooks", "Rich embed messages", "Role-based notifications"],
    authFields: [
      { key: "webhook_url", label: "Discord Webhook URL", type: "url", placeholder: "https://discord.com/api/webhooks/…", required: true },
      { key: "username", label: "Bot Username", type: "text", placeholder: "Genesis AI", required: false },
    ],
  },
  {
    id: "whatsapp", name: "WhatsApp Business", category: "communication",
    icon: "📱", color: "from-emerald-500/30 to-emerald-600/10", iconBg: "bg-emerald-500/20",
    authType: "api_key", isNew: true,
    description: "Automate WhatsApp Business messages and customer support.",
    longDesc: "Use the WhatsApp Business API to send automated responses, order updates, and support messages to your customers at scale.",
    features: ["Send template messages", "Automated replies", "Order notifications", "Support ticket routing"],
    authFields: [
      { key: "access_token", label: "WhatsApp Business API Token", type: "password", placeholder: "EAAxxxxx…", required: true },
      { key: "phone_id", label: "Phone Number ID", type: "text", placeholder: "123456789", required: true },
    ],
  },
  {
    id: "telegram", name: "Telegram", category: "communication",
    icon: "✈️", color: "from-cyan-500/30 to-cyan-600/10", iconBg: "bg-cyan-500/20",
    authType: "api_key",
    description: "Send Telegram bot messages and handle customer chats.",
    longDesc: "Connect your Telegram Bot to send notifications, handle customer inquiries, and automate message flows via the Bot API.",
    features: ["Send messages via bot", "Receive and process messages", "Group and channel posting", "Inline keyboard buttons"],
    authFields: [
      { key: "bot_token", label: "Bot Token", type: "password", placeholder: "123456:ABCdef…", required: true },
      { key: "chat_id", label: "Default Chat ID", type: "text", placeholder: "-100123456", required: false },
    ],
  },

  /* ── Commerce ─────────────────────────────────────────────────────────── */
  {
    id: "shopify", name: "Shopify", category: "commerce",
    icon: "🛒", color: "from-green-500/30 to-green-600/10", iconBg: "bg-green-500/20",
    authType: "oauth", popular: true,
    description: "Sync orders, customers, and products from your Shopify store.",
    longDesc: "Connect Shopify to automate order confirmations, customer support, returns processing, and product recommendations using AI.",
    features: ["Order event triggers", "Customer data access", "Product catalog sync", "Return automation", "Inventory alerts"],
    authFields: [{ key: "shop_domain", label: "Shop Domain", type: "text", placeholder: "mystore.myshopify.com", required: true }],
  },
  {
    id: "woocommerce", name: "WooCommerce", category: "commerce",
    icon: "🛍", color: "from-purple-500/30 to-purple-600/10", iconBg: "bg-purple-500/20",
    authType: "api_key",
    description: "Integrate with WooCommerce WordPress stores.",
    longDesc: "Connect your WooCommerce store to automate order management, customer support, and inventory workflows using Genesis AI.",
    features: ["Order webhooks", "Customer management", "Product sync", "Coupon automation"],
    authFields: [
      { key: "store_url", label: "Store URL", type: "url", placeholder: "https://mystore.com", required: true },
      { key: "consumer_key", label: "Consumer Key", type: "text", placeholder: "ck_xxx…", required: true },
      { key: "consumer_secret", label: "Consumer Secret", type: "password", placeholder: "cs_xxx…", required: true },
    ],
  },
  {
    id: "trendyol", name: "Trendyol", category: "commerce",
    icon: "🧡", color: "from-orange-500/30 to-orange-600/10", iconBg: "bg-orange-500/20",
    authType: "api_key", region: "Turkey", isNew: true,
    description: "Turkey's largest e-commerce platform integration.",
    longDesc: "Connect your Trendyol seller account to automate order processing, customer messages, return requests, and product listing management.",
    features: ["Order management", "Customer messaging", "Return processing", "Product updates", "Cargo tracking"],
    authFields: [
      { key: "supplier_id", label: "Supplier ID", type: "text", placeholder: "123456", required: true },
      { key: "api_key", label: "API Key", type: "password", placeholder: "Your Trendyol API Key", required: true },
      { key: "api_secret", label: "API Secret", type: "password", placeholder: "Your Trendyol API Secret", required: true },
    ],
  },
  {
    id: "hepsiburada", name: "Hepsiburada", category: "commerce",
    icon: "🔴", color: "from-red-500/30 to-red-600/10", iconBg: "bg-red-500/20",
    authType: "api_key", region: "Turkey",
    description: "Automate your Hepsiburada seller operations with AI.",
    longDesc: "Integrate Hepsiburada to automate customer support, order fulfillment notifications, and return management for your marketplace listings.",
    features: ["Order notifications", "Customer Q&A automation", "Return management", "Rating monitoring"],
    authFields: [
      { key: "username", label: "Merchant Username", type: "text", placeholder: "your-username", required: true },
      { key: "password", label: "API Password", type: "password", placeholder: "Your API Password", required: true },
    ],
  },
  {
    id: "n11", name: "N11", category: "commerce",
    icon: "🟡", color: "from-yellow-500/30 to-yellow-600/10", iconBg: "bg-yellow-500/20",
    authType: "api_key", region: "Turkey",
    description: "Manage N11 marketplace orders and customer messages.",
    longDesc: "Connect your N11 seller account to handle customer inquiries, process orders automatically, and track return requests with AI assistance.",
    features: ["Order management", "Customer messaging", "Product listing", "Return processing"],
    authFields: [
      { key: "api_key", label: "App Key", type: "text", placeholder: "Your App Key", required: true },
      { key: "api_secret", label: "App Secret", type: "password", placeholder: "Your App Secret", required: true },
    ],
  },
  {
    id: "ideasoft", name: "IdeaSoft / Ticimax", category: "commerce",
    icon: "💡", color: "from-blue-500/30 to-blue-600/10", iconBg: "bg-blue-500/20",
    authType: "api_key", region: "Turkey",
    description: "Turkish e-commerce infrastructure (IdeaSoft & Ticimax) integration.",
    longDesc: "Automate orders, inventory, and customer support for IdeaSoft and Ticimax-powered online stores in Turkey.",
    features: ["Order webhooks", "Inventory sync", "Customer support AI", "Product management"],
    authFields: [
      { key: "store_url", label: "Store URL", type: "url", placeholder: "https://mystore.com", required: true },
      { key: "api_token", label: "API Token", type: "password", placeholder: "Your API Token", required: true },
    ],
  },

  /* ── CRM ──────────────────────────────────────────────────────────────── */
  {
    id: "hubspot", name: "HubSpot", category: "crm",
    icon: "🎯", color: "from-orange-500/30 to-orange-600/10", iconBg: "bg-orange-500/20",
    authType: "oauth", popular: true,
    description: "Sync contacts, deals, and activities with HubSpot CRM.",
    longDesc: "Integrate HubSpot to automatically create contacts, log conversations, update deals, and trigger sales workflows from AI interactions.",
    features: ["Create/update contacts", "Log AI conversations", "Update deal pipeline", "Trigger sequences", "Track email opens"],
    authFields: [{ key: "private_app_token", label: "HubSpot Private App Token", type: "password", placeholder: "pat-na1-xxx…", required: true }],
  },
  {
    id: "salesforce", name: "Salesforce", category: "crm",
    icon: "☁️", color: "from-blue-500/30 to-blue-600/10", iconBg: "bg-blue-500/20",
    authType: "oauth",
    description: "Sync leads, opportunities, and accounts with Salesforce.",
    longDesc: "Connect Salesforce to have your AI employees automatically create leads, update opportunities, and log activity records in your CRM.",
    features: ["Lead creation", "Opportunity updates", "Activity logging", "Custom object support", "Flow triggers"],
    authFields: [
      { key: "instance_url", label: "Salesforce Instance URL", type: "url", placeholder: "https://mycompany.my.salesforce.com", required: true },
    ],
  },

  /* ── Productivity ─────────────────────────────────────────────────────── */
  {
    id: "notion", name: "Notion", category: "productivity",
    icon: "📝", color: "from-zinc-500/30 to-zinc-600/10", iconBg: "bg-zinc-500/20",
    authType: "api_key",
    description: "Write AI-generated content directly to Notion databases.",
    longDesc: "Connect Notion to let your Content AI automatically create pages, update databases, and manage your team's knowledge base.",
    features: ["Create pages", "Update databases", "Append blocks", "Read pages for context", "Manage properties"],
    authFields: [
      { key: "integration_token", label: "Notion Integration Token", type: "password", placeholder: "secret_xxx…", required: true },
      { key: "database_id", label: "Default Database ID", type: "text", placeholder: "32-char database ID", required: false },
    ],
  },
  {
    id: "gdrive", name: "Google Drive", category: "productivity",
    icon: "📁", color: "from-green-500/30 to-green-600/10", iconBg: "bg-green-500/20",
    authType: "oauth",
    description: "Access, create, and manage files in Google Drive.",
    longDesc: "Connect Google Drive to upload AI-generated documents, read files for knowledge, and organize your workspace automatically.",
    features: ["Read files for knowledge", "Create documents", "Upload generated content", "Manage folders", "Share files"],
    authFields: [{ key: "service_account", label: "Service Account JSON", type: "text", placeholder: "Paste JSON key here", required: true }],
  },
  {
    id: "dropbox", name: "Dropbox", category: "productivity",
    icon: "📦", color: "from-blue-500/30 to-blue-600/10", iconBg: "bg-blue-500/20",
    authType: "oauth",
    description: "Store and retrieve files from your Dropbox account.",
    longDesc: "Integrate Dropbox to save AI-generated reports, access knowledge files, and manage document workflows automatically.",
    features: ["Upload files", "Read for knowledge", "Folder management", "Shared link creation"],
    authFields: [{ key: "access_token", label: "Dropbox Access Token", type: "password", placeholder: "sl.Axxxxx…", required: true }],
  },

  /* ── Accounting ───────────────────────────────────────────────────────── */
  {
    id: "parasut", name: "Paraşüt", category: "accounting",
    icon: "🧮", color: "from-teal-500/30 to-teal-600/10", iconBg: "bg-teal-500/20",
    authType: "oauth", region: "Turkey", isNew: true,
    description: "Turkish cloud accounting and invoicing platform.",
    longDesc: "Connect Paraşüt to automate invoice creation, expense tracking, and financial reporting for Turkish businesses.",
    features: ["Create invoices", "Track expenses", "Customer management", "Financial reports", "E-Invoice (e-Fatura)"],
    authFields: [
      { key: "client_id", label: "Paraşüt Client ID", type: "text", placeholder: "Your Client ID", required: true },
      { key: "client_secret", label: "Client Secret", type: "password", placeholder: "Your Client Secret", required: true },
    ],
  },
  {
    id: "logo", name: "Logo", category: "accounting",
    icon: "📊", color: "from-red-500/30 to-red-600/10", iconBg: "bg-red-500/20",
    authType: "api_key", region: "Turkey",
    description: "Turkey's leading ERP and accounting software.",
    longDesc: "Integrate Logo ERP (Tiger, Go, etc.) to automate financial data flows, customer records, and order processing between your AI workflows and accounting.",
    features: ["Invoice automation", "Customer sync", "Order import", "Stock management", "Financial reporting"],
    authFields: [
      { key: "server_url", label: "Logo API Server URL", type: "url", placeholder: "http://your-logo-server:8080", required: true },
      { key: "api_key", label: "API Key", type: "password", placeholder: "Your Logo API Key", required: true },
    ],
  },
  {
    id: "mikro", name: "Mikro", category: "accounting",
    icon: "💼", color: "from-blue-500/30 to-blue-600/10", iconBg: "bg-blue-500/20",
    authType: "api_key", region: "Turkey",
    description: "Mikro accounting and ERP integration for Turkish SMEs.",
    longDesc: "Connect Mikro Yazılım to automate invoice generation, customer billing, and financial data synchronization for Turkish businesses.",
    features: ["Invoice creation", "Customer management", "Payment tracking", "Stock management", "E-Archive support"],
    authFields: [
      { key: "database", label: "Database Name", type: "text", placeholder: "MIKRODB", required: true },
      { key: "api_key", label: "Integration Key", type: "password", placeholder: "Your Integration Key", required: true },
    ],
  },

  /* ── Developer ────────────────────────────────────────────────────────── */
  {
    id: "webhook", name: "Webhook", category: "developer",
    icon: "🔗", color: "from-violet-500/30 to-violet-600/10", iconBg: "bg-violet-500/20",
    authType: "webhook", popular: true,
    description: "Send HTTP POST requests to any URL from workflows.",
    longDesc: "Use generic webhooks to connect Genesis AI to any platform that accepts HTTP requests. Perfect for custom integrations and internal tools.",
    features: ["HTTP POST to any URL", "Custom headers", "JSON payload templating", "Retry on failure", "Response handling"],
    authFields: [
      { key: "url", label: "Webhook URL", type: "url", placeholder: "https://your-app.com/webhook", required: true },
      { key: "secret", label: "Signing Secret (optional)", type: "password", placeholder: "Used to verify payloads", required: false },
      { key: "headers", label: "Custom Headers (JSON)", type: "text", placeholder: '{"Authorization": "Bearer …"}', required: false },
    ],
  },
  {
    id: "rest_api", name: "REST API", category: "developer",
    icon: "⚙️", color: "from-zinc-500/30 to-zinc-600/10", iconBg: "bg-zinc-500/20",
    authType: "api_key",
    description: "Call any REST API from your workflow nodes.",
    longDesc: "The universal REST API integration lets your AI employees call any HTTP endpoint — GET, POST, PUT, or DELETE — as part of any workflow.",
    features: ["All HTTP methods", "Custom headers & auth", "JSON/form-data body", "Response extraction", "Error handling"],
    authFields: [
      { key: "base_url", label: "Base URL", type: "url", placeholder: "https://api.example.com/v1", required: true },
      { key: "auth_header", label: "Authorization Header", type: "text", placeholder: "Bearer your-token", required: false },
    ],
  },
];
