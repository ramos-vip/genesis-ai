import type { EmployeeRole } from "../types";

export interface RoleDefinition {
  id:          EmployeeRole;
  label:       string;
  shortLabel:  string;
  description: string;
  gradient:    string;
  /** Role-specific suggested description */
  suggestions: string[];
}

export const EMPLOYEE_ROLES: RoleDefinition[] = [
  {
    id:          "support",
    label:       "Customer Support",
    shortLabel:  "Support",
    description: "Handle inquiries, resolve tickets, and support customers 24/7.",
    gradient:    "from-blue-600/20 to-blue-600/5",
    suggestions: [
      "Respond to customer inquiries within 2 minutes, resolve tier-1 tickets automatically, and escalate complex issues to the right team member.",
      "Answer FAQs, process refund requests, and follow up with customers post-resolution to ensure satisfaction.",
      "Handle live chat on our website, categorize incoming tickets by urgency, and maintain a response time under 3 minutes.",
    ],
  },
  {
    id:          "sales",
    label:       "Sales",
    shortLabel:  "Sales",
    description: "Qualify leads, book meetings, and follow up with prospects at scale.",
    gradient:    "from-violet-600/20 to-violet-600/5",
    suggestions: [
      "Qualify inbound leads, identify high-intent prospects, and automatically book discovery calls with our sales team.",
      "Send personalized outreach sequences to cold leads, follow up 3 times over 2 weeks, and log all activity in CRM.",
      "Research prospect companies, write customized pitches, and prepare meeting briefs for the sales team.",
    ],
  },
  {
    id:          "seo",
    label:       "SEO",
    shortLabel:  "SEO",
    description: "Research keywords, audit your site, and publish content that ranks.",
    gradient:    "from-orange-600/20 to-orange-600/5",
    suggestions: [
      "Research high-intent keywords for our niche, audit top 20 pages for on-page SEO issues, and provide weekly optimization reports.",
      "Monitor competitor rankings, identify content gaps, and suggest blog topics with search volume over 1,000/month.",
      "Write SEO-optimized meta titles and descriptions for all product pages, improving click-through rates from search.",
    ],
  },
  {
    id:          "content",
    label:       "Content",
    shortLabel:  "Content",
    description: "Write blog posts, copy, and creative briefs in your brand voice.",
    gradient:    "from-emerald-600/20 to-emerald-600/5",
    suggestions: [
      "Write 2 long-form blog posts per week in our brand voice, including SEO optimization, internal links, and a compelling CTA.",
      "Create social media content calendars, write captions for LinkedIn and Twitter, and draft email newsletter copy.",
      "Produce product descriptions, landing page copy, and A/B test variants for our marketing team.",
    ],
  },
  {
    id:          "email",
    label:       "Email",
    shortLabel:  "Email",
    description: "Write, personalize, and send email campaigns that convert.",
    gradient:    "from-rose-600/20 to-rose-600/5",
    suggestions: [
      "Write and schedule weekly email newsletters, segment the list by engagement, and A/B test subject lines.",
      "Build automated drip sequences for new signups, design re-engagement campaigns for churned users.",
      "Personalize outbound sales emails based on prospect data, track open rates, and suggest subject line improvements.",
    ],
  },
  {
    id:          "operations",
    label:       "Operations",
    shortLabel:  "Operations",
    description: "Automate workflows, summarize data, and keep your team moving.",
    gradient:    "from-cyan-600/20 to-cyan-600/5",
    suggestions: [
      "Summarize daily standup notes, track action items, and send automated reminders to team members about deadlines.",
      "Process incoming invoices, extract key data, update our spreadsheets, and flag anomalies for review.",
      "Monitor key business metrics daily, generate weekly reports, and alert the team when KPIs fall outside target ranges.",
    ],
  },
  {
    id:          "custom",
    label:       "Custom",
    shortLabel:  "Custom",
    description: "Build a fully custom AI employee for your specific use case.",
    gradient:    "from-pink-600/20 to-pink-600/5",
    suggestions: [
      "Describe exactly what tasks this AI employee should handle, the tools it will use, and the outcomes you expect.",
      "Define the specific workflow, inputs, outputs, and any special rules or exceptions this employee should follow.",
    ],
  },
];

export const ROLE_BY_ID = Object.fromEntries(
  EMPLOYEE_ROLES.map((r) => [r.id, r])
) as Record<EmployeeRole, RoleDefinition>;

/** Max characters for description field */
export const DESCRIPTION_MAX_LENGTH = 500;

/** Wizard step definitions */
export const WIZARD_STEPS = [
  { label: "Name",        description: "What's their name?" },
  { label: "Role",        description: "What will they do?" },
  { label: "Description", description: "Define their job" },
  { label: "Knowledge",   description: "Training data" },
  { label: "Review",      description: "Confirm and create" },
] as const;

export const TOTAL_STEPS = WIZARD_STEPS.length;
