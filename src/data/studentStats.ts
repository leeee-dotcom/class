import type { Student, SubjectGrade } from './types'

/*
 * 상세 화면 맨 위 요약 타일에 쓰는 값들. 회의에서 "이 학생 뭐부터 볼까"에 답하는 숫자다.
 * 계산 규칙이 화면 여기저기 흩어지지 않도록 한곳에 모아두고 테스트한다.
 */

export function latestGrades(student: Student): SubjectGrade[] {
  return student.semesters.at(-1)?.grades ?? []
}

export function latestAverage(student: Student): number {
  const grades = latestGrades(student)
  if (grades.length === 0) return 0

  const total = grades.reduce((sum, grade) => sum + grade.score, 0)
  return Math.round(total / grades.length)
}

export type SubjectShift = { subject: string; diff: number }

/** 직전 학기 대비 오른 과목과 떨어진 과목. 변화가 큰 순으로 정렬한다. */
export function subjectShifts(student: Student): { risen: SubjectShift[]; fallen: SubjectShift[] } {
  const previous = student.semesters.at(-2)
  const latest = student.semesters.at(-1)
  if (!previous || !latest) return { risen: [], fallen: [] }

  const shifts = latest.grades.map((grade, index) => ({
    subject: grade.subject,
    diff: grade.score - (previous.grades[index]?.score ?? grade.score),
  }))

  return {
    risen: shifts.filter((shift) => shift.diff > 0).sort((a, b) => b.diff - a.diff),
    fallen: shifts.filter((shift) => shift.diff < 0).sort((a, b) => a.diff - b.diff),
  }
}

export type SubjectScore = { subject: string; score: number; level: string }

/** 최근 학기 점수가 높은 순 상위 과목. 회의에서 "이 학생은 뭘 잘하나"에 답한다. */
export function strongSubjects(student: Student, count = 3): SubjectScore[] {
  return [...latestGrades(student)].sort((a, b) => b.score - a.score).slice(0, count)
}

/** 최근 학기 점수가 낮은 순 하위 과목. */
export function weakSubjects(student: Student, count = 3): SubjectScore[] {
  return [...latestGrades(student)].sort((a, b) => a.score - b.score).slice(0, count)
}

export function countLevelA(student: Student): number {
  return latestGrades(student).filter((grade) => grade.level === 'A').length
}

function averageOf(grades: SubjectGrade[]): number {
  if (grades.length === 0) return 0
  return grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length
}

export type ClassSummary = {
  count: number
  average: number
  risen: number
  fallen: number
}

/** 첫 화면에서 반 전체 상태를 한 줄로 알려주기 위한 값 */
export function classSummary(students: Student[]): ClassSummary {
  const averages = students.map((student) => ({
    latest: averageOf(student.semesters.at(-1)?.grades ?? []),
    previous: averageOf(student.semesters.at(-2)?.grades ?? []),
  }))

  const overall = averages.length
    ? averages.reduce((sum, entry) => sum + entry.latest, 0) / averages.length
    : 0

  return {
    count: students.length,
    average: Math.round(overall),
    risen: averages.filter((entry) => entry.latest > entry.previous).length,
    fallen: averages.filter((entry) => entry.latest < entry.previous).length,
  }
}
