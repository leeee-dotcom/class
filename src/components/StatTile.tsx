import './StatTile.css'

export type StatTone = 'neutral' | 'up' | 'down' | 'mark'

/** 색만으로 뜻이 전달되지 않도록 톤마다 기호를 함께 둔다. */
const DEFAULT_ICONS: Record<StatTone, string> = {
  neutral: '평',
  up: '▲',
  down: '▼',
  mark: '★',
}

type Props = {
  label: string
  value: string
  /** 값 아래 한 줄 설명. 회의에서 무엇을 뜻하는 숫자인지 바로 알리기 위한 것 */
  detail?: string
  tone?: StatTone
  /** 톤 기본값 대신 쓸 기호 */
  icon?: string
}

export function StatTile({ label, value, detail, tone = 'neutral', icon }: Props) {
  return (
    <div className={`stat-tile stat-tile--${tone}`}>
      <span className="stat-tile__icon" aria-hidden="true">
        {icon ?? DEFAULT_ICONS[tone]}
      </span>
      <div className="stat-tile__body">
        <div className="stat-tile__value tabular">{value}</div>
        <div className="stat-tile__label">{label}</div>
        {detail && <div className="stat-tile__detail tabular">{detail}</div>}
      </div>
    </div>
  )
}
