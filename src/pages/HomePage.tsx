import { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { MeetingGuide } from '../components/MeetingGuide'
import { StatTile } from '../components/StatTile'
import { listStudents } from '../data/studentRepo'
import { classSummary, type ClassSummary } from '../data/studentStats'
import './HomePage.css'

export function HomePage() {
  const [summary, setSummary] = useState<ClassSummary | null>(null)

  useEffect(() => {
    let active = true
    listStudents().then((students) => {
      if (active) setSummary(classSummary(students))
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="home">
      <MeetingGuide />

      {/* 기준 학기는 데이터에서 읽는다. 적어두면 학기가 늘어날 때 따라오지 않는다 */}
      <Card title="반 전체" note={summary ? `${summary.semester} 기준` : undefined}>
        {summary === null ? (
          <p className="home__status">불러오는 중입니다…</p>
        ) : (
          <div className="home__tiles">
            <StatTile label="학생 수" value={`${summary.count}명`} />
            <StatTile label="반 평균" value={`${summary.average}점`} detail="5과목 원점수 평균" />
            <StatTile
              label="평균이 오른 학생"
              value={`${summary.risen}명`}
              detail="직전 학기 대비"
              tone="up"
            />
            <StatTile
              label="평균이 떨어진 학생"
              value={`${summary.fallen}명`}
              detail="직전 학기 대비"
              tone="down"
            />
          </div>
        )}
      </Card>
    </div>
  )
}
