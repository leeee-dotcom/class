import type { AchievementLevel, Semester, Student } from './types'

/*
 * 전부 가상의 학생이다. 실존 인물과 무관하며, 실제 학생 정보를 이 파일에 넣지 않는다.
 * 회의 시연이 목적이므로 성적이 오른 학생, 떨어진 학생, 과목 편차가 큰 학생을 섞은
 * 표본 5명만 둔다. 실제로 쓸 때는 이 배열만 늘리면 화면은 그대로 동작한다.
 */

export const SUBJECTS = ['국어', '영어', '수학', '사회', '과학'] as const
const SEMESTER_LABELS = ['2학년 1학기', '2학년 2학기', '3학년 1학기'] as const

/** 중학교 성취평가제 기준. 원점수 하나에서 성취도를 파생시켜 둘이 어긋날 일을 없앤다. */
function levelOf(score: number): AchievementLevel {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'E'
}

/** 국어·영어·수학·사회·과학 순서의 원점수 */
type Scores = [number, number, number, number, number]

function semesters(first: Scores, second: Scores, third: Scores): Semester[] {
  return [first, second, third].map((scores, i) => ({
    label: SEMESTER_LABELS[i],
    grades: SUBJECTS.map((subject, s) => ({
      subject,
      score: scores[s],
      level: levelOf(scores[s]),
    })),
  }))
}

/** 3학년 3반. 학번은 번호에서 만들어 둘이 어긋날 일을 없앤다. */
const CLASS_PREFIX = '303'

const ROSTER: Omit<Student, 'studentNo'>[] = [
  {
    id: 's01',
    number: 1,
    name: '강도윤',
    personality: '차분하고 말수가 적지만 맡은 일은 끝까지 해낸다. 질문을 잘 하지 않아 이해했는지 확인이 필요하다.',
    peerNote: '같은 초등학교 출신 두세 명과 주로 다닌다. 모둠이 바뀌어도 무리 없이 섞인다.',
    career: {
      strengths: '끈기, 계획대로 실행하는 힘',
      interests: '기계 조립, 자동차',
      aptitude: '수리력이 빠르게 오르고 있음. 손으로 만드는 활동에서 집중력이 높다',
      hope: '자동차 정비 또는 기계 분야',
      recommended: '기계·자동차 정비 기술직',
      hopeHighschool: '마이스터고(기계)',
      highschools: ['마이스터고(기계)', '공업계 특성화고(자동차과)', '일반고'],
    },
    careerTests: [
      { name: '커리어넷 직업흥미검사', type: '현실형·탐구형' },
      { name: '홀랜드 진로탐색검사', type: '현실형(R) 우세' },
    ],
    semesters: semesters([72, 68, 74, 75, 78], [76, 71, 83, 78, 82], [80, 75, 91, 81, 86]),
  },
  {
    id: 's02',
    number: 2,
    name: '김나연',
    personality: '발표를 즐기고 자기 생각을 분명히 말한다. 관심 없는 과목에는 노력을 거의 들이지 않는다.',
    peerNote: '친구가 많고 분위기를 이끈다. 다만 특정 친구와 사소한 갈등이 반복된다는 이야기가 있어 확인이 필요하다.',
    career: {
      strengths: '표현력, 사람들 앞에서 말하기',
      interests: '역사, 사회 문제',
      aptitude: '언어·사회 영역이 뚜렷이 강하고 수리 영역과 격차가 크다',
      hope: '변호사 또는 사회 관련 연구',
      recommended: '법조·사회과학 계열 (수학 보완 전제)',
      hopeHighschool: '외국어고',
      highschools: ['외국어고', '일반고(인문)', '자율형 사립고'],
    },
    careerTests: [
      { name: '홀랜드 진로탐색검사', type: '사회형(S)·진취형(E)' },
      { name: '커리어넷 직업적성검사', type: '언어·대인관계 능력 상위' },
    ],
    semesters: semesters([94, 88, 62, 96, 68], [95, 90, 58, 97, 66], [96, 91, 61, 97, 70]),
  },
  {
    id: 's03',
    number: 3,
    name: '김태오',
    personality: '활발하고 친구를 잘 챙긴다. 최근 수업 중 엎드려 있는 일이 늘었다.',
    peerNote: '교우 관계는 넓은 편. 다만 3학년 들어 어울리는 무리가 바뀌면서 지각이 함께 늘었다.',
    career: {
      strengths: '순발력, 분위기를 밝게 만드는 힘',
      interests: '운동, 게임',
      aptitude: '기초 학력은 충분하나 학습 시간이 확보되지 않고 있다',
      hope: '아직 정하지 못함',
      recommended: '체육·스포츠 지도 분야부터 탐색',
      hopeHighschool: '아직 정하지 못함',
      highschools: ['일반고', '체육 중점 과정 운영교', '특성화고(스포츠산업)'],
    },
    careerTests: [{ name: '커리어넷 직업흥미검사', type: '현실형·진취형' }],
    semesters: semesters([82, 80, 78, 85, 81], [74, 70, 68, 76, 72], [65, 61, 55, 66, 60]),
  },
  {
    id: 's04',
    number: 4,
    name: '나윤서',
    personality: '궁금한 것을 끝까지 파고든다. 관심 주제가 나오면 수업 흐름과 상관없이 질문이 길어진다.',
    peerNote: '소수의 친구와 깊게 지낸다. 과학 동아리에서 특히 편안해한다.',
    career: {
      strengths: '탐구력, 실험 설계',
      interests: '천문, 생명과학',
      aptitude: '과학 영역이 압도적으로 높고 꾸준하다',
      hope: '연구원',
      recommended: '자연과학 연구직',
      hopeHighschool: '과학고',
      highschools: ['과학고', '과학중점학교', '일반고(자연)'],
    },
    careerTests: [
      { name: '홀랜드 진로탐색검사', type: '탐구형(I) 강함' },
      { name: '커리어넷 직업적성검사', type: '논리·수리 능력 상위' },
    ],
    semesters: semesters([84, 82, 92, 80, 97], [86, 85, 94, 82, 98], [85, 87, 95, 83, 99]),
  },
  {
    id: 's05',
    number: 5,
    name: '배연우',
    personality: '책임감이 강하고 약속을 잘 지킨다. 부담을 혼자 안고 가는 경향이 있다.',
    peerNote: '친한 친구 두 명과 붙어 지낸다. 그중 한 명이 전학 간 뒤로 위축된 모습이 보인다.',
    career: {
      strengths: '꼼꼼함, 자료 정리',
      interests: '회계, 사무',
      aptitude: '수학이 뚜렷이 떨어지고 있어 원인 확인이 필요하다',
      hope: '금융 또는 사무 분야',
      recommended: '회계·사무 관리직',
      hopeHighschool: '일반고(인문)',
      highschools: ['일반고(인문)', '상업계 특성화고', '자율형 공립고'],
    },
    careerTests: [
      { name: '홀랜드 진로탐색검사', type: '관습형(C) 우세' },
      { name: '커리어넷 직업적성검사', type: '수리·사무 능력' },
    ],
    semesters: semesters([86, 84, 88, 85, 82], [85, 83, 76, 84, 80], [84, 82, 64, 83, 78]),
  },
]

export const STUDENTS: Student[] = ROSTER.map((student) => ({
  ...student,
  studentNo: `${CLASS_PREFIX}${String(student.number).padStart(2, '0')}`,
}))
