import './SummaryPair.css'

type Props = {
  label: string
  /** 학생이 원하는 것 */
  hope: string
  /** 회의에서 권하는 것 */
  recommended: string
}

/**
 * 머리말에 놓는 요약 타일. 회의의 논점은 늘 "학생이 원하는 것"과 "우리가 권하는 것"의
 * 거리이므로 둘을 한 칸에 붙여 놓고 바로 비교하게 한다.
 */
export function SummaryPair({ label, hope, recommended }: Props) {
  return (
    <div className="summary-pair">
      <div className="summary-pair__label">{label}</div>
      <dl className="summary-pair__rows">
        <div className="summary-pair__row">
          <dt>희망</dt>
          <dd>{hope}</dd>
        </div>
        <div className="summary-pair__row summary-pair__row--recommended">
          <dt>추천</dt>
          <dd>{recommended}</dd>
        </div>
      </dl>
    </div>
  )
}
