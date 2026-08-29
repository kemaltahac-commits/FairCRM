import type { Activity } from '../../types'
import {
  CallIcon,
  DealsIcon,
  EmailIcon,
  MeetingIcon,
  NoteIcon,
} from '../icons/Icons'

interface RecentActivitiesProps {
  activities: Activity[]
}

const activityConfig = {
  call: {
    icon: CallIcon,
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  email: {
    icon: EmailIcon,
    bg: 'bg-violet-50',
    text: 'text-violet-600',
  },
  meeting: {
    icon: MeetingIcon,
    bg: 'bg-amber-50',
    text: 'text-amber-600',
  },
  deal: {
    icon: DealsIcon,
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  note: {
    icon: NoteIcon,
    bg: 'bg-slate-100',
    text: 'text-slate-600',
  },
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recent Activities</h3>
          <p className="text-sm text-slate-500">Latest updates across your CRM</p>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
        >
          View all
        </button>
      </div>

      <ul className="divide-y divide-slate-100">
        {activities.map((activity) => {
          const config = activityConfig[activity.type]
          const Icon = config.icon

          return (
            <li key={activity.id} className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-slate-50">
              <div className={`mt-0.5 rounded-lg p-2 ${config.bg}`}>
                <Icon className={`h-4 w-4 ${config.text}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{activity.description}</p>
                  </div>
                  <time className="shrink-0 text-xs text-slate-400">{activity.timestamp}</time>
                </div>
                <p className="mt-2 text-xs font-medium text-indigo-600">{activity.contact}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
