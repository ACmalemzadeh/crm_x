type MetricCardProps = {
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
}

export function MetricCard({
  label,
  value,
  change,
  changeType = 'neutral',
}: MetricCardProps) {
  return (
    <div className="metric-card">
      <p className="metric-label">{label}</p>
      <h3 className="metric-value">{value}</h3>
      {change && <p className={`metric-change ${changeType}`}>{change}</p>}
    </div>
  )
}
