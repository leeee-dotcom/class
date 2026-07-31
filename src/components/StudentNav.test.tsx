import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { StudentNav, neighborsOf } from './StudentNav'
import type { Student } from '../data/types'

function student(id: string, number: number, name: string): Student {
  return {
    id,
    studentNo: `203${String(number).padStart(2, '0')}`,
    number,
    name,
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
    semesters: [],
  }
}

const students = [student('a', 1, '가온'), student('b', 2, '나온'), student('c', 3, '다온')]

function CurrentPath() {
  return <span data-testid="path">{useLocation().pathname}</span>
}

function renderNav(currentId: string) {
  const { previous, next } = neighborsOf(students, currentId)
  return render(
    <MemoryRouter initialEntries={[`/students/${currentId}`]}>
      <StudentNav previous={previous} next={next} />
      <Routes>
        <Route path="/students/:id" element={<CurrentPath />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('neighborsOf', () => {
  it('가운데 학생은 앞뒤 학생을 모두 갖는다', () => {
    expect(neighborsOf(students, 'b')).toEqual({ previous: students[0], next: students[2] })
  })

  it('첫 학생에는 이전이, 마지막 학생에는 다음이 없다', () => {
    expect(neighborsOf(students, 'a').previous).toBeNull()
    expect(neighborsOf(students, 'c').next).toBeNull()
  })

  it('목록에 없는 id면 양쪽 모두 없다', () => {
    expect(neighborsOf(students, '없음')).toEqual({ previous: null, next: null })
  })
})

describe('StudentNav', () => {
  it('첫 학생에서는 이전 버튼 대신 안내를 보여준다', () => {
    renderNav('a')

    expect(screen.getByText('← 첫 번째 학생입니다')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /나온/ })).toBeInTheDocument()
  })

  it('마지막 학생에서는 다음 버튼 대신 안내를 보여준다', () => {
    renderNav('c')

    expect(screen.getByText('마지막 학생입니다 →')).toBeInTheDocument()
  })

  it('오른쪽 화살표 키로 다음 학생으로 넘어간다', async () => {
    renderNav('b')

    await userEvent.keyboard('{ArrowRight}')

    expect(screen.getByTestId('path')).toHaveTextContent('/students/c')
  })

  it('왼쪽 화살표 키로 이전 학생으로 넘어간다', async () => {
    renderNav('b')

    await userEvent.keyboard('{ArrowLeft}')

    expect(screen.getByTestId('path')).toHaveTextContent('/students/a')
  })

  it('마지막 학생에서 오른쪽 화살표를 눌러도 이동하지 않는다', async () => {
    renderNav('c')

    await userEvent.keyboard('{ArrowRight}')

    expect(screen.getByTestId('path')).toHaveTextContent('/students/c')
  })
})
