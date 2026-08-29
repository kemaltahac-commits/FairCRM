export interface PageMeta {
  title: string
  subtitle: string
}

export const pageMeta: Record<string, PageMeta> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: "Welcome back, Alex. Here's your overview.",
  },
  contacts: {
    title: 'Contacts',
    subtitle: 'Manage and track all your customer relationships.',
  },
  deals: {
    title: 'Deals',
    subtitle: 'Track your sales pipeline and opportunities.',
  },
  tasks: {
    title: 'Tasks',
    subtitle: 'Stay on top of your to-dos and follow-ups.',
  },
  reports: {
    title: 'Reports',
    subtitle: 'Analyze performance and business insights.',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Configure your account and preferences.',
  },
}
