import StatsCard from '../StatsCard'
import { Bus } from 'lucide-react'

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <StatsCard title="Active Routes" value={12} icon={Bus} trend={{ value: 8, isPositive: true }} />
      <StatsCard title="Total Students" value={245} icon={Bus} />
    </div>
  )
}
