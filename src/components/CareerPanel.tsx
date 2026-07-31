import type { Career } from '../data/types'
import { ProfileField } from './ProfileField'
import './CareerPanel.css'

/*
 * 회의에서 읽는 순서 그대로 쌓는다: 강점 → 흥미 → 적성 → 희망 진로.
 * 강점을 맨 위에 붉은 글씨로 두어 무엇을 잘하는지부터 보고 진로 이야기로 넘어간다.
 * 고등학교는 별도 카드에서 다루므로 여기서는 사람에 대한 이야기만 담는다.
 */
export function CareerPanel({ career }: { career: Career }) {
  return (
    <div className="career-panel">
      <ProfileField label="강점" highlight>
        {career.strengths}
      </ProfileField>
      <ProfileField label="흥미">{career.interests}</ProfileField>
      <ProfileField label="적성">{career.aptitude}</ProfileField>
      <ProfileField label="희망 진로">{career.hope}</ProfileField>
    </div>
  )
}
