import type { Semester } from '../data/types'
import './GradeTable.css'

/*
 * 회의에서 제일 먼저 짚는 화면이다. 점수 자체보다 "어느 과목이 어떻게 변했는가"가 중요해서
 * 직전 학기 대비 변화를 기호(▲▼)와 색으로 함께 표시한다. 색만으로 구분하지 않는다.
 */

export type Trend = {
  direction: 'up' | 'down' | 'same'
  diff: number
  /** 10점 이상 움직인 경우. 회의에서 반드시 언급되어야 하는 변화. */
  major: boolean
}

export function trendOf(previous: number | undefined, current: number): Trend | null {
  if (previous === undefined) return null

  const diff = current - previous
  return {
    direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'same',
    diff,
    major: Math.abs(diff) >= 10,
  }
}

function TrendMark({ trend }: { trend: Trend }) {
  if (trend.direction === 'same') {
    return (
      <span className="grade-trend grade-trend--same" aria-label="직전 학기와 같음">
        –
      </span>
    )
  }

  const up = trend.direction === 'up'
  const amount = Math.abs(trend.diff)

  return (
    <span
      className={`grade-trend grade-trend--${trend.direction}${trend.major ? ' grade-trend--major' : ''}`}
      aria-label={`직전 학기 대비 ${amount}점 ${up ? '상승' : '하락'}`}
    >
      {up ? '▲' : '▼'} {amount}
    </span>
  )
}

type Props = {
  semesters: Semester[]
}

export function GradeTable({ semesters }: Props) {
  const subjects = semesters[0]?.grades.map((grade) => grade.subject) ?? []

  return (
    <div className="grade-table__scroll">
      <table className="grade-table">
        <caption className="grade-table__caption">
          원점수와 성취도, 그리고 직전 학기 대비 변화
        </caption>
        <thead>
          <tr>
            <th scope="col">과목</th>
            {semesters.map((semester) => (
              <th scope="col" key={semester.label}>
                {semester.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, row) => (
            <tr key={subject}>
              <th scope="row">{subject}</th>
              {semesters.map((semester, column) => {
                const grade = semester.grades[row]
                const previous = semesters[column - 1]?.grades[row]?.score
                const trend = trendOf(previous, grade.score)

                return (
                  <td key={semester.label}>
                    <span className="grade-score">{grade.score}</span>
                    <span className="grade-level">({grade.level})</span>
                    {trend && <TrendMark trend={trend} />}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
