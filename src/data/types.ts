export type AchievementLevel = 'A' | 'B' | 'C' | 'D' | 'E'

export type SubjectGrade = {
  subject: string
  score: number // 원점수
  level: AchievementLevel // 성취도
}

export type Semester = {
  label: string // "1학년 1학기"
  grades: SubjectGrade[]
}

export type CareerTest = {
  name: string // "커리어넷 직업흥미검사"
  type: string // "예술형·사회형"
}

export type Career = {
  strengths: string // 강점
  interests: string // 흥미
  aptitude: string // 적성
  hope: string // 학생이 희망하는 진로
  recommended: string // 회의에서 권하는 진로
  hopeHighschool: string // 학생이 가고 싶어 하는 고등학교
  highschools: string[] // 회의에서 검토할 추천 고등학교
}

export type Student = {
  id: string
  /** 학번. 학년 + 반 + 번호를 붙인 5자리 (예: 20303) */
  studentNo: string
  /** 반 안에서의 번호 */
  number: number
  name: string
  /** 지금은 비어 있다. 값이 있으면 사진을, 없으면 이니셜 아바타를 쓴다. */
  photoUrl?: string
  personality: string
  peerNote: string // 교우관계 메모
  career: Career
  careerTests: CareerTest[]
  /** 오래된 학기 → 최근 학기 순 */
  semesters: Semester[]
}
