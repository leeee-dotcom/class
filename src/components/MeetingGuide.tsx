import { Card } from './Card'
import './MeetingGuide.css'

/**
 * 이 앱은 "학생 회의를 이렇게 진행하겠다"를 보여주는 안내 자료다.
 * 처음 보는 사람이 화면의 용도를 곧바로 알 수 있도록 첫 화면 맨 위에 진행 순서를 둔다.
 */
export function MeetingGuide() {
  return (
    <Card title="회의는 이렇게 진행합니다" note="왼쪽 명단에서 학생을 고르면 시작합니다">
      <ol className="meeting-guide__steps">
        <li>왼쪽 명단에서 논의할 학생을 고릅니다.</li>
        <li>성적 요약을 함께 봅니다. 크게 오르거나 떨어진 과목이 먼저 보입니다.</li>
        <li>진로·성격·교우관계를 이어서 논의합니다.</li>
        <li>좌우 화살표 키로 다음 학생에게 넘어갑니다.</li>
      </ol>
    </Card>
  )
}
