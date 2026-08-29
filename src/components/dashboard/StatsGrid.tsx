import type { StatCardData } from '../../types'
import { StatCard } from './StatCard'

interface StatsGridProps {
  stats: StatCardData[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} data={stat} />
      ))}
    </div>
  )
}
