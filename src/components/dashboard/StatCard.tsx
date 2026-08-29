import type { StatCardData } from '../../types'
import {
  ContactsIcon,
  DealsIcon,
  RevenueIcon,
  TasksIcon,
} from '../icons/Icons'

interface StatCardProps {
  data: StatCardData
}

const iconMap = {
  contacts: ContactsIcon,
  deals: DealsIcon,
  revenue: RevenueIcon,
  tasks: TasksIcon,
}

const iconStyles = {
  contacts: 'bg-blue-50 text-blue-600',
  deals: 'bg-violet-50 text-violet-600',
  revenue: 'bg-emerald-50 text-emerald-600',
  tasks: 'bg-amber-50 text-amber-600',
}

const changeStyles = {
  positive: 'text-emerald-600',
  negative: 'text-red-600',
  neutral: 'text-slate-500',
}

export function StatCard({ data }: StatCardProps) {
  const Icon = iconMap[data.icon]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{data.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{data.value}</p>
        </div>
        <div className={`rounded-lg p-2.5 ${iconStyles[data.icon]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className={`mt-4 text-sm font-medium ${changeStyles[data.changeType]}`}>
        {data.change}
        {data.changeType === 'positive' && (
          <span className="ml-1 font-normal text-slate-400">vs last month</span>
        )}
      </p>
    </div>
  )
}
