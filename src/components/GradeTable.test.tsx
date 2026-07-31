import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GradeTable, trendOf } from './GradeTable'
import type { Semester } from '../data/types'

const semesters: Semester[] = [
  {
    label: '1학년 1학기',
    grades: [
      { subject: '국어', score: 80, level: 'B' },
      { subject: '수학', score: 90, level: 'A' },
    ],
  },
  {
    label: '1학년 2학기',
    grades: [
      { subject: '국어', score: 87, level: 'B' },
      { subject: '수학', score: 75, level: 'C' },
    ],
  },
]

describe('trendOf', () => {
  it('직전 학기가 없으면 변화를 계산하지 않는다', () => {
    expect(trendOf(undefined, 80)).toBeNull()
  })

  it('오르면 up, 내리면 down, 같으면 same', () => {
    expect(trendOf(80, 87)?.direction).toBe('up')
    expect(trendOf(90, 75)?.direction).toBe('down')
    expect(trendOf(80, 80)?.direction).toBe('same')
  })

  it('10점 이상 움직이면 major로 표시한다', () => {
    expect(trendOf(90, 75)?.major).toBe(true)
    expect(trendOf(90, 80)?.major).toBe(true)
    expect(trendOf(80, 87)?.major).toBe(false)
  })
})

describe('GradeTable', () => {
  it('학기별 원점수와 성취도를 함께 보여준다', () => {
    render(<GradeTable semesters={semesters} />)

    expect(screen.getByRole('columnheader', { name: '1학년 1학기' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '1학년 2학기' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: '국어' })).toBeInTheDocument()
    expect(screen.getByText('87')).toBeInTheDocument()
    expect(screen.getAllByText('(A)').length).toBeGreaterThan(0)
  })

  it('직전 학기 대비 변화를 기호와 함께 읽을 수 있게 표시한다', () => {
    render(<GradeTable semesters={semesters} />)

    expect(screen.getByLabelText('직전 학기 대비 7점 상승')).toHaveTextContent('▲')
    expect(screen.getByLabelText('직전 학기 대비 15점 하락')).toHaveTextContent('▼')
  })

  it('첫 학기에는 변화 표시를 붙이지 않는다', () => {
    render(<GradeTable semesters={semesters} />)

    expect(screen.queryAllByLabelText(/직전 학기 대비/)).toHaveLength(2)
  })
})
