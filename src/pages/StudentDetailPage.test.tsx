import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { StudentDetailPage } from './StudentDetailPage'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/students/:id" element={<StudentDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('StudentDetailPage', () => {
  it('학생의 성적·진로·성격·교우관계를 모두 보여준다', async () => {
    renderAt('/students/s02')

    expect(await screen.findByText('김나연')).toBeInTheDocument()

    // 학번
    expect(screen.getByText('학번')).toBeInTheDocument()
    expect(screen.getByText('30302')).toBeInTheDocument()

    // 성적: 추이 꺾은선과 학기별 표
    expect(screen.getByRole('img', { name: /학기별 성적 추이/ })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '3학년 1학기' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: '수학' })).toBeInTheDocument()

    // 진로: 강점·흥미·적성·희망 진로·고교 추천
    expect(screen.getByText('강점')).toBeInTheDocument()
    expect(screen.getByText('흥미')).toBeInTheDocument()
    expect(screen.getByText('적성')).toBeInTheDocument()
    // 고등학교: 희망과 추천을 나란히
    expect(screen.getByText('희망 고등학교')).toBeInTheDocument()
    expect(screen.getByText('추천 고등학교')).toBeInTheDocument()
    expect(screen.getAllByText('외국어고').length).toBeGreaterThan(0)

    // 머리말 요약: 진로와 고등학교를 희망/추천 쌍으로
    const summaries = screen.getAllByText('희망').map((node) => node.closest('.summary-pair')!)
    expect(summaries).toHaveLength(2)
    expect(summaries[0]).toHaveTextContent('법조·사회과학 계열')
    expect(summaries[1]).toHaveTextContent('외국어고 · 일반고(인문) · 자율형 사립고')

    // 진로검사
    expect(screen.getByText('홀랜드 진로탐색검사')).toBeInTheDocument()

    // 성격과 교우관계
    expect(screen.getByText('성격')).toBeInTheDocument()
    expect(screen.getByText('교우관계')).toBeInTheDocument()
  })

  it('잘하는 과목과 약한 과목을 과목명으로 보여준다', async () => {
    renderAt('/students/s02')

    expect(await screen.findByText('잘하는 과목')).toBeInTheDocument()
    expect(screen.getByText('약한 과목')).toBeInTheDocument()

    // 국어 96 / 사회 97 이 강하고, 수학 61 / 과학 70 이 약한 학생
    const strong = screen.getByText('잘하는 과목').closest('.subject-list')!
    const weak = screen.getByText('약한 과목').closest('.subject-list')!

    expect(strong).toHaveTextContent('사회')
    expect(strong).toHaveTextContent('97')
    expect(weak).toHaveTextContent('수학')
    expect(weak).toHaveTextContent('61')
  })

  it('강점은 강조 상자로 떼어 놓는다', async () => {
    renderAt('/students/s02')

    const strengths = await screen.findByText('강점')

    expect(strengths.closest('.profile-field')).toHaveClass('profile-field--highlight')
  })

  it('성적이 크게 떨어진 과목을 변화 표시로 알려준다', async () => {
    renderAt('/students/s03')

    await screen.findByText('김태오')

    expect(screen.getAllByLabelText(/직전 학기 대비 .*하락/).length).toBeGreaterThan(0)
  })

  it('없는 학생이면 안내 문구와 목록 링크를 보여준다', async () => {
    renderAt('/students/없는-학생')

    expect(await screen.findByText('학생을 찾을 수 없습니다.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '학생 목록으로 돌아가기' })).toBeInTheDocument()
  })

  it('첫 학생에서는 이전으로 넘어갈 수 없다', async () => {
    renderAt('/students/s01')

    expect(await screen.findByText('← 첫 번째 학생입니다')).toBeInTheDocument()
  })

  it('오른쪽 화살표 키를 누르면 다음 학생으로 넘어간다', async () => {
    renderAt('/students/s01')
    await screen.findByText('강도윤')

    await userEvent.keyboard('{ArrowRight}')

    expect(await screen.findByText('김나연')).toBeInTheDocument()
  })
})
