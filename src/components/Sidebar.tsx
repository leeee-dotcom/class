import { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { listStudents } from '../data/studentRepo'
import type { Student } from '../data/types'
import { Avatar } from './Avatar'
import './Sidebar.css'

/*
 * 회의 중에는 목록과 상세를 오가는 것이 아니라, 목록을 옆에 띄워두고 학생만 바꾼다.
 * 그래서 명단을 페이지가 아니라 항상 보이는 사이드바에 둔다.
 */
export function Sidebar() {
  const [students, setStudents] = useState<Student[] | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let active = true
    listStudents().then((loaded) => {
      if (active) setStudents(loaded)
    })
    return () => {
      active = false
    }
  }, [])

  const matched = useMemo(() => {
    if (!students) return []
    const keyword = query.trim()
    if (!keyword) return students

    return students.filter(
      (student) => student.name.includes(keyword) || String(student.number) === keyword,
    )
  }, [students, query])

  return (
    <aside className="sidebar">
      <NavLink className="sidebar__brand" to="/">
        진로중학교
        <span className="sidebar__brand-sub">학생 진로 성장 회의</span>
      </NavLink>

      <div className="sidebar__search">
        <label className="sidebar__search-label" htmlFor="student-search">
          학생 찾기
        </label>
        <input
          id="student-search"
          className="sidebar__search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="이름 또는 번호"
        />
      </div>

      {students === null ? (
        <p className="sidebar__status">명단을 불러오는 중입니다…</p>
      ) : matched.length === 0 ? (
        <p className="sidebar__status">검색 결과가 없습니다.</p>
      ) : (
        <nav aria-label="학생 명단">
          <ul className="sidebar__list">
            {matched.map((student) => (
              <li key={student.id}>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'sidebar__item sidebar__item--active' : 'sidebar__item'
                  }
                  to={`/students/${student.id}`}
                >
                  <Avatar name={student.name} photoUrl={student.photoUrl} size="sm" />
                  <span className="sidebar__number tabular">{student.number}</span>
                  <span className="sidebar__name">{student.name}</span>
                  <span className="sidebar__no tabular">{student.studentNo}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </aside>
  )
}
