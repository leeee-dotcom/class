import type { SubjectScore } from '../data/studentStats'
import './SubjectList.css'

/*
 * 잘하는 과목 / 약한 과목. 개수만 보여주면 회의에서 다시 물어보게 되므로
 * 과목명과 점수를 함께 적는다.
 */

type Props = {
  label: string
  subjects: SubjectScore[]
  tone: 'strong' | 'weak'
}

export function SubjectList({ label, subjects, tone }: Props) {
  return (
    <div className={`subject-list subject-list--${tone}`}>
      <div className="subject-list__label">
        <span className="subject-list__mark" aria-hidden="true">
          {tone === 'strong' ? '▲' : '▼'}
        </span>
        {label}
      </div>
      {subjects.length === 0 ? (
        <p className="subject-list__empty">기록이 없습니다.</p>
      ) : (
        <ol className="subject-list__items">
          {subjects.map((subject) => (
            <li key={subject.subject}>
              <span className="subject-list__name">{subject.subject}</span>
              <span className="subject-list__score tabular">{subject.score}</span>
              <span className="subject-list__level">{subject.level}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
