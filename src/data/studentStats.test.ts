import { describe, expect, it } from 'vitest'
import {
  countLevelA,
  latestAverage,
  strongSubjects,
  subjectShifts,
  weakSubjects,
} from './studentStats'
import type { Student } from './types'

function studentWith(
  first: number[],
  second: number[],
  subjects = ['국어', '영어', '수학'],
): Student {
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

  /** 실제 화면과 같은 5과목 학생 */
  const fiveSubjects = () =>
    studentWith(
      [70, 70, 70, 70, 70],
      [96, 91, 61, 97, 70],
      ['국어', '영어', '수학', '사회', '과학'],
    )

  it('잘하는 과목을 점수가 높은 순으로 뽑는다', () => {
    expect(strongSubjects(fiveSubjects()).map((s) => s.subject)).toEqual(['사회', '국어'])
  })

  it('약한 과목을 점수가 낮은 순으로 뽑는다', () => {
    expect(weakSubjects(fiveSubjects()).map((s) => s.subject)).toEqual(['수학', '과학'])
  })

  it('한 과목이 잘하는 과목과 약한 과목에 동시에 들어가지 않는다', () => {
    const student = fiveSubjects()
    const strong = strongSubjects(student).map((s) => s.subject)
    const weak = weakSubjects(student).map((s) => s.subject)

    expect(strong.filter((subject) => weak.includes(subject))).toEqual([])
  })

  it('최근 학기의 성취도 A 과목 수를 센다', () => {
    expect(countLevelA(studentWith([70, 70, 70], [90, 91, 70]))).toBe(2)
  })
})
