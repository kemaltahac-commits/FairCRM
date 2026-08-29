import type { ContactStatus } from '../../types'

interface StatusBadgeProps {
  status: ContactStatus
}

const statusConfig: Record<ContactStatus, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  },
  lead: {
    label: 'Lead',
    className: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  },
  customer: {
    label: 'Customer',
    className: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  },
  prospect: {
    label: 'Prospect',
    className: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  )
}
