type QuickStatCardProps = {
  title: string
  stats: { label: string; value: string | number; icon?: string }[]
}

export function QuickStatCard({ title, stats }: QuickStatCardProps) {
  return (
    <div className="stat-card">
      <h4>{title}</h4>
      <div className="stat-details">
        {stats.map((stat, index) => (
          <div key={index} className="stat-row">
            {stat.icon && <span className={`status-dot ${stat.icon}`}></span>}
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
