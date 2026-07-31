import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { Card } from '../components/Card'
import { CareerPanel } from '../components/CareerPanel'
import { CareerTestList } from '../components/CareerTestList'
import { GradeTable } from '../components/GradeTable'
import { ProfileField } from '../components/ProfileField'
import { GradeTrendChart } from '../components/GradeTrendChart'
import { StudentNav, neighborsOf } from '../components/StudentNav'
import { SubjectList } from '../components/SubjectList'
import { SummaryPair } from '../components/SummaryPair'
import { listStudents } from '../data/studentRepo'
import { strongSubjects, weakSubjects } from '../data/studentStats'
import type { Student } from '../data/types'
import './StudentDetailPage.css'

type State =
  | { status: 'loading' }
  | { status: 'notFound' }
  | { status: 'ready'; student: Student; previous: Student | null; next: Student | null }

export function StudentDetailPage() {
  const { id = '' } = useParams()
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let active = true
    setState({ status: 'loading' })

    // 이전/다음 이동이 회의의 기본 동선이라 목록 전체가 함께 필요하다
    listStudents().then((students) => {
      if (!active) return

      const student = students.find((candidate) => candidate.id === id)
      if (!student) {
        setState({ status: 'notFound' })
        return
      }

      const { previous, next } = neighborsOf(students, id)
      setState({ status: 'ready', student, previous, next })
    })

    return () => {
      active = false
    }
  }, [id])

  if (state.status === 'loading') return <p className="detail-status">불러오는 중입니다…</p>

  if (state.status === 'notFound') {
    return (
      <div className="detail-status">
        <p>학생을 찾을 수 없습니다.</p>
        <Link to="/">학생 목록으로 돌아가기</Link>
      </div>
    )
  }

  const { student, previous, next } = state

  return (
    <article className="detail">
      <section className="detail__head">
        <div className="detail__portrait">
          <Avatar name={student.name} photoUrl={student.photoUrl} size="lg" />
          <p className="detail__portrait-note">얼굴은 가상으로 만든 이미지입니다</p>
        </div>

        <div className="detail__identity">
          <div className="detail__name">{student.name}</div>
          <dl className="detail__meta">
            <div>
              <dt>학번</dt>
              <dd className="tabular">{student.studentNo}</dd>
            </div>
            <div>
              <dt>번호</dt>
              <dd className="tabular">{student.number}번</dd>
            </div>
          </dl>
          <StudentNav previous={previous} next={next} />
        </div>

        <div className="detail__tiles">
          <SummaryPair
            label="진로"
            hope={student.career.hope}
            recommended={student.career.recommended}
          />
          <SummaryPair
            label="고등학교"
            hope={student.career.hopeHighschool}
            recommended={student.career.highschools.join(' · ')}
          />
          <SubjectList label="잘하는 과목" subjects={strongSubjects(student)} tone="strong" />
          <SubjectList label="약한 과목" subjects={weakSubjects(student)} tone="weak" />
        </div>
      </section>

      <div className="detail__columns">
        {/* 성적은 회의에서 가장 오래 보는 칸이라 가장 넓게 잡는다 */}
        <div className="detail__column detail__column--grades">
          <Card title="학기별 성적 추이" note="과목별 원점수. 세로축은 40점부터">
            <GradeTrendChart semesters={student.semesters} />
          </Card>

          <Card title="학기별 성적" note="원점수와 성취도, 직전 학기 대비 변화">
            <GradeTable semesters={student.semesters} />
          </Card>
        </div>

        <div className="detail__column">
          <Card title="성격 · 교우관계">
            <ProfileField label="성격">{student.personality}</ProfileField>
            <ProfileField label="교우관계">{student.peerNote}</ProfileField>
          </Card>
        </div>

        <div className="detail__column">
          <Card title="진로" note="강점 · 흥미 · 적성 · 희망 진로 · 검사 결과">
            <CareerPanel career={student.career} />
            <h3 className="detail__subhead">진로검사 결과</h3>
            <CareerTestList tests={student.careerTests} />
          </Card>
        </div>

        <div className="detail__column">
          <Card title="고등학교" note="희망과 추천을 나란히 놓고 논의합니다">
            <ProfileField label="희망 고등학교">{student.career.hopeHighschool}</ProfileField>
            <ProfileField label="추천 고등학교">
              <ul className="detail__schools">
                {student.career.highschools.map((school) => (
                  <li key={school}>{school}</li>
                ))}
              </ul>
            </ProfileField>
          </Card>
        </div>
      </div>
    </article>
  )
}
