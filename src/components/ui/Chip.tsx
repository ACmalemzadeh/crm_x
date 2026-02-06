type ChipProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Chip({ children, className = '', style }: ChipProps) {
  return <span className={`chip ${className}`} style={style}>{children}</span>
}
