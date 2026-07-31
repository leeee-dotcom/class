import type { CareerTest } from '../data/types'
import './CareerTestList.css'

type Props = {
  tests: CareerTest[]
}

export function CareerTestList({ tests }: Props) {
  if (tests.length === 0) {
    return <p className="career-test__empty">기록된 진로검사 결과가 없습니다.</p>
  }

  return (
    <ul className="career-test-list">
      {tests.map((test) => (
        <li key={test.name} className="career-test">
          <span className="career-test__name">{test.name}</span>
          <span className="career-test__type">{test.type}</span>
        </li>
      ))}
    </ul>
  )
}
