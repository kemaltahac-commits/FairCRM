import type { NavItem } from '../../types'
import {
  ContactsIcon,
  DashboardIcon,
  DealsIcon,
  ReportsIcon,
  SettingsIcon,
  TasksIcon,
} from '../icons/Icons'

interface SidebarProps {
  items: NavItem[]
  activeItem: string
  onItemClick: (id: string) => void
}

const iconMap = {
  dashboard: DashboardIcon,
  contacts: ContactsIcon,
  deals: DealsIcon,
  tasks: TasksIcon,
  reports: ReportsIcon,
  settings: SettingsIcon,
}

export function Sidebar({ items, activeItem, onItemClick }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
          <span className="text-sm font-bold text-white">F</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">FairCRM</h1>
          <p className="text-xs text-slate-500">Customer Management</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = activeItem === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemClick(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-900">Pro Plan</p>
          <p className="mt-1 text-xs text-slate-500">2,847 of 5,000 contacts used</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-[57%] rounded-full bg-indigo-600" />
          </div>
        </div>
      </div>
    </aside>
  )
}
