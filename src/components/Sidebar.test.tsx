import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Sidebar } from './Sidebar'

function renderSidebar() {
  return render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>,
  )
}

describe('Sidebar', () => {
  it('학생 명단을 보여준다', async () => {
    renderSidebar()

    expect(await screen.findByRole('link', { name: /강도윤/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /배연우/ })).toBeInTheDocument()
  })

  it('이름으로 검색하면 해당 학생만 남는다', async () => {
    renderSidebar()
    await screen.findByRole('link', { name: /강도윤/ })

    await userEvent.type(screen.getByLabelText('학생 찾기'), '나연')

    expect(screen.getByRole('link', { name: /김나연/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /강도윤/ })).not.toBeInTheDocument()
  })

  it('번호로도 찾을 수 있다', async () => {
    renderSidebar()
    await screen.findByRole('link', { name: /강도윤/ })

    await userEvent.type(screen.getByLabelText('학생 찾기'), '5')

    expect(screen.getByRole('link', { name: /배연우/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /강도윤/ })).not.toBeInTheDocument()
  })

  it('맞는 학생이 없으면 안내 문구를 보여준다', async () => {
    renderSidebar()
    await screen.findByRole('link', { name: /강도윤/ })

    await userEvent.type(screen.getByLabelText('학생 찾기'), '존재하지않는이름')

    expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument()
  })
})
