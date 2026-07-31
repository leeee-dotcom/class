import type { Semester } from '../data/types'
import './GradeTrendChart.css'

/*
 * 학기별 성적 추이. 과목마다 선 하나씩.
 *
 * 색 배정은 검증 스크립트를 돌려 정했다 (validate_palette.js). 다섯 색 모두 통과했지만
 * 수학↔사회 쌍이 적록색약에서 ΔE 6.8로 경고 구간이라, 각 선 끝에 과목명을 직접 붙인다.
 * 그래서 색을 구분하지 못해도 어느 선이 어느 과목인지 알 수 있고, 범례를 오가며
 * 색을 대조할 필요도 없어진다.
 */

const SERIES_COLORS = ['#0066cc', '#c76a00', '#0a8a5f', '#b0143c', '#7a3fd4']

/** 40점 아래로는 그리지 않는다. 60~100 구간의 차이를 크게 보여주기 위한 것 */
const Y_MIN = 40
const Y_MAX = 100

const VIEW = { width: 420, height: 250 }
const PAD = { top: 14, right: 96, bottom: 30, left: 34 }
const PLOT = {
  left: PAD.left,
  right: VIEW.width - PAD.right,
  top: PAD.top,
  bottom: VIEW.height - PAD.bottom,
}

const GRID_LINES = [40, 60, 80, 100]
/** 끝 라벨이 서로 겹치지 않도록 벌려 놓는 최소 간격 */
const LABEL_GAP = 15

function yOf(score: number): number {
  const clamped = Math.min(Math.max(score, Y_MIN), Y_MAX)
  const ratio = (clamped - Y_MIN) / (Y_MAX - Y_MIN)
  return PLOT.bottom - ratio * (PLOT.bottom - PLOT.top)
}

function xOf(index: number, count: number): number {
  if (count <= 1) return PLOT.left
  return PLOT.left + (index * (PLOT.right - PLOT.left)) / (count - 1)
}

/** 끝 라벨이 겹치면 아래로 밀어 낸다 */
function spreadLabels(labels: { y: number }[]): number[] {
  const order = labels.map((label, index) => ({ index, y: label.y })).sort((a, b) => a.y - b.y)
  const result = new Array<number>(labels.length)
  let previous = -Infinity

  for (const entry of order) {
    const y = Math.max(entry.y, previous + LABEL_GAP)
    result[entry.index] = y
    previous = y
  }
  return result
}

type Props = {
  semesters: Semester[]
}

export function GradeTrendChart({ semesters }: Props) {
  const subjects = semesters[0]?.grades.map((grade) => grade.subject) ?? []
  if (subjects.length === 0 || semesters.length === 0) return null

  const series = subjects.map((subject, row) => {
    const scores = semesters.map((semester) => semester.grades[row]?.score ?? 0)
    return {
      subject,
      scores,
      color: SERIES_COLORS[row % SERIES_COLORS.length],
      points: scores.map((score, column) => ({
        x: xOf(column, semesters.length),
        y: yOf(score),
      })),
    }
  })

  const labelYs = spreadLabels(series.map((line) => ({ y: line.points.at(-1)!.y })))

  const summary = series
    .map((line) => `${line.subject} ${line.scores.join('점, ')}점`)
    .join(' / ')

  return (
    <div className="trend-chart">
      <svg
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        role="img"
        aria-label={`학기별 성적 추이. ${semesters.map((s) => s.label).join(', ')} 순서로 ${summary}`}
      >
        {GRID_LINES.map((score) => (
          <g key={score}>
            <line
              className="trend-chart__grid"
              x1={PLOT.left}
              x2={PLOT.right}
              y1={yOf(score)}
              y2={yOf(score)}
            />
            <text className="trend-chart__axis" x={PLOT.left - 8} y={yOf(score) + 4} textAnchor="end">
              {score}
            </text>
          </g>
        ))}

        {semesters.map((semester, column) => (
          <text
            key={semester.label}
            className="trend-chart__axis"
            x={xOf(column, semesters.length)}
            y={VIEW.height - 10}
            textAnchor={column === 0 ? 'start' : column === semesters.length - 1 ? 'end' : 'middle'}
          >
            {semester.label.replace('학년 ', '-')}
          </text>
        ))}

        {series.map((line) => (
          <g key={line.subject}>
            <polyline
              className="trend-chart__line"
              points={line.points.map((point) => `${point.x},${point.y}`).join(' ')}
              stroke={line.color}
            />
            {line.points.map((point, column) => (
              <circle
                key={column}
                className="trend-chart__dot"
                cx={point.x}
                cy={point.y}
                r="4.5"
                fill={line.color}
              />
            ))}
          </g>
        ))}

        {series.map((line, row) => (
          <text
            key={line.subject}
            className="trend-chart__label"
            x={PLOT.right + 10}
            y={labelYs[row] + 4}
            fill={line.color}
          >
            {line.subject} {line.scores.at(-1)}
          </text>
        ))}
      </svg>
    </div>
  )
}
