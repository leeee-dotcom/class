import { describe, expect, it } from 'vitest'
import { getStudent, listStudents } from './studentRepo'

describe('studentRepo', () => {
  it('학생 목록을 번호순으로 돌려준다', async () => {
    const students = await listStudents()

    expect(students.length).toBeGreaterThan(0)
    const numbers = students.map((s) => s.number)
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b))
  })

  it('id로 학생 한 명을 찾는다', async () => {
    const [first] = await listStudents()

    await expect(getStudent(first.id)).resolves.toEqual(first)
  })

  it('없는 id면 null을 돌려준다', async () => {
    await expect(getStudent('없는-id')).resolves.toBeNull()
  })

  it('학번은 학년·반 접두사에 번호를 두 자리로 붙인 값이다', async () => {
    const students = await listStudents()

    expect(students[0].studentNo).toBe('30301')
    expect(students.at(-1)?.studentNo).toBe('30305')
    expect(new Set(students.map((s) => s.studentNo)).size).toBe(students.length)
  })

  it('모든 학생이 학기별 성적을 오래된 순으로 가지고 있다', async () => {
    const students = await listStudents()

    for (const student of students) {
      expect(student.semesters.length).toBeGreaterThanOrEqual(2)
      expect(student.semesters.map((s) => s.label)).toEqual([
        '2학년 1학기',
        '2학년 2학기',
        '3학년 1학기',
      ])
    }
  })
})
