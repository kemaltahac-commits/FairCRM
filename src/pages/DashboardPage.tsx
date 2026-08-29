import { StatsGrid } from '../components/dashboard/StatsGrid'
import { RecentActivities } from '../components/dashboard/RecentActivities'
import type { Activity, StatCardData } from '../types'

interface DashboardPageProps {
  stats: StatCardData[]
  activities: Activity[]
}

export function DashboardPage({ stats, activities }: DashboardPageProps) {
  return (
    <div className="space-y-8">
      <StatsGrid stats={stats} />
      <RecentActivities activities={activities} />
    </div>
  )
}
