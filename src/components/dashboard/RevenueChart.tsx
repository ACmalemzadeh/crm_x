type RevenueChartProps = {
  data: { month: string; value: number }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className="revenue-chart">
      <h3>Revenue Trend (Past 12 Months)</h3>
      <div className="chart-container">
        {data.map((item, index) => (
          <div key={index} className="chart-bar">
            <div
              className="bar"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
              }}
            />
            <p className="bar-label">{item.month.split(' ')[0]}</p>
            <p className="bar-value">${item.value}K</p>
          </div>
        ))}
      </div>
    </div>
  )
}
