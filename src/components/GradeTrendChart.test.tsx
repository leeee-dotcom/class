import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GradeTrendChart } from './GradeTrendChart'
import type { Semester } from '../data/types'

const semesters: Semester[] = [
  {
    label: '2학년 1학기',
    grades: [
      { subject: '국어', score: 80, level: 'B' },
      { subject: '수학', score: 90, level: 'A' },
    ],
  },
  {
    label: '3학년 1학기',
    grades: [
      { subject: '국어', score: 88, level: 'B' },
      { subject: '수학', score: 62, level: 'D' },
    ],
  },
]

describe('GradeTrendChart', () => {
  it('과목마다 선을 하나씩 그린다', () => {
    const { container } = render(<GradeTrendChart semesters={semesters} />)

    expect(container.querySelectorAll('.trend-chart__line')).toHaveLength(2)
  })

  it('색을 구분하지 못해도 알 수 있도록 선 끝에 과목명과 점수를 적는다', () => {
    render(<GradeTrendChart semesters={semesters} />)

    expect(screen.getByText('국어 88')).toBeInTheDocument()
    expect(screen.getByText('수학 62')).toBeInTheDocument()
  })

  it('그림 전체를 읽어주는 설명을 붙인다', () => {
    render(<GradeTrendChart semesters={semesters} />)

    const chart = screen.getByRole('img', { name: /학기별 성적 추이/ })
    expect(chart).toHaveAccessibleName(/국어 80점, 88점/)
  })

  it('학기 라벨을 축에 적는다', () => {
    render(<GradeTrendChart semesters={semesters} />)

    expect(screen.getByText('2-1학기')).toBeInTheDocument()
    expect(screen.getByText('3-1학기')).toBeInTheDocument()
  })

  it('성적이 없으면 아무것도 그리지 않는다', () => {
    const { container } = render(<GradeTrendChart semesters={[]} />)

    expect(container.querySelector('svg')).toBeNull()
  })
})
