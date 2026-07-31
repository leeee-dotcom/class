import { describe, expect, it } from 'vitest'
import {
  countLevelA,
  latestAverage,
  strongSubjects,
  subjectShifts,
  weakSubjects,
} from './studentStats'
import type { Student } from './types'

function studentWith(first: number[], second: number[]): Student {
  const subjects = ['국어', '영어', '수학']
  const semester = (label: string, scores: number[]) => ({
    label,
    grades: subjects.map((subject, i) => ({
      subject,
      score: scores[i],
      level: (scores[i] >= 90 ? 'A' : scores[i] >= 80 ? 'B' : 'C') as 'A' | 'B' | 'C',
    })),
  })

  return {
    id: 'x',
    studentNo: '20301',
    number: 1,
    name: '가온',
    personality: '',
    peerNote: '',
    career: {
      strengths: '',
      interests: '',
      aptitude: '',
      hope: '',
      recommended: '',
      hopeHighschool: '',
      highschools: [],
    },
    careerTests: [],
    semesters: [semester('1학기', first), semester('2학기', second)],
  }
}

describe('studentStats', () => {
  it('최근 학기 평균을 반올림해서 돌려준다', () => {
    expect(latestAverage(studentWith([70, 70, 70], [90, 80, 85]))).toBe(85)
  })

  it('오른 과목과 떨어진 과목을 변화가 큰 순으로 나눈다', () => {
    const { risen, fallen } = subjectShifts(studentWith([80, 80, 80], [95, 70, 82]))

    expect(risen).toEqual([
      { subject: '국어', diff: 15 },
      { subject: '수학', diff: 2 },
    ])
    expect(fallen).toEqual([{ subject: '영어', diff: -10 }])
  })

  it('변화가 없는 과목은 어느 쪽에도 넣지 않는다', () => {
    const { risen, fallen } = subjectShifts(studentWith([80, 80, 80], [80, 80, 80]))

    expect(risen).toEqual([])
    expect(fallen).toEqual([])
  })

  it('잘하는 과목을 점수가 높은 순으로 뽑는다', () => {
    const result = strongSubjects(studentWith([70, 70, 70], [82, 95, 60]), 2)

    expect(result.map((s) => s.subject)).toEqual(['영어', '국어'])
  })

  it('약한 과목을 점수가 낮은 순으로 뽑는다', () => {
    const result = weakSubjects(studentWith([70, 70, 70], [82, 95, 60]), 2)

    expect(result.map((s) => s.subject)).toEqual(['수학', '국어'])
  })

  it('최근 학기의 성취도 A 과목 수를 센다', () => {
    expect(countLevelA(studentWith([70, 70, 70], [90, 91, 70]))).toBe(2)
  })
})
