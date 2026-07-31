import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Student } from '../data/types'
import './StudentNav.css'

/*
 * 회의에서는 학생을 번호순으로 넘기며 논의한다. 매번 목록으로 돌아가면 흐름이 끊기므로
 * 이전/다음 버튼과 좌우 화살표 키를 함께 제공한다.
 */

export function neighborsOf(students: Student[], currentId: string) {
  const index = students.findIndex((student) => student.id === currentId)
  if (index === -1) return { previous: null, next: null }

  return {
    previous: students[index - 1] ?? null,
    next: students[index + 1] ?? null,
  }
}

type Props = {
  previous: Student | null
  next: Student | null
}

export function StudentNav({ previous, next }: Props) {
  const navigate = useNavigate()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) return

      // 검색창 등에 입력 중일 때는 화살표를 가로채지 않는다
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return

      if (event.key === 'ArrowLeft' && previous) navigate(`/students/${previous.id}`)
      if (event.key === 'ArrowRight' && next) navigate(`/students/${next.id}`)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [previous, next, navigate])

  return (
    <nav className="student-nav" aria-label="학생 간 이동">
      {previous ? (
        <Link className="student-nav__link" to={`/students/${previous.id}`}>
          ← {previous.number}. {previous.name}
        </Link>
      ) : (
        <span className="student-nav__link student-nav__link--disabled" aria-disabled="true">
          ← 첫 번째 학생입니다
        </span>
      )}

      <span className="student-nav__hint">좌우 화살표 키로도 넘길 수 있습니다</span>

      {next ? (
        <Link className="student-nav__link" to={`/students/${next.id}`}>
          {next.number}. {next.name} →
        </Link>
      ) : (
        <span className="student-nav__link student-nav__link--disabled" aria-disabled="true">
          마지막 학생입니다 →
        </span>
      )}
    </nav>
  )
}
