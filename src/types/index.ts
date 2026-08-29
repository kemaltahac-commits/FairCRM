export interface NavItem {
  id: string
  label: string
  icon: 'dashboard' | 'contacts' | 'deals' | 'tasks' | 'reports' | 'settings'
}

export interface StatCardData {
  id: string
  label: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: 'contacts' | 'deals' | 'revenue' | 'tasks'
}

export interface Activity {
  id: string
  type: 'call' | 'email' | 'meeting' | 'deal' | 'note'
  title: string
  description: string
  contact: string
  timestamp: string
}

export type ContactStatus = 'active' | 'lead' | 'customer' | 'prospect' | 'inactive'

export interface Contact {
  id: string
  firstName: string
  lastName: string
  company: string
  email: string
  status: ContactStatus
  lastContact: string
  phone: string
}

export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'

export interface Deal {
  id: string
  title: string
  contact_id: string
  value: number
  stage: DealStage
  created_at: string
}
