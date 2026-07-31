import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('회의 진행 순서를 안내한다', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(screen.getByText('회의는 이렇게 진행합니다')).toBeInTheDocument()
    expect(await screen.findByText('5명')).toBeInTheDocument()
  })

  it('반 전체 요약을 보여준다', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(await screen.findByText('반 평균')).toBeInTheDocument()
    expect(screen.getByText('평균이 오른 학생')).toBeInTheDocument()
    expect(screen.getByText('평균이 떨어진 학생')).toBeInTheDocument()
  })
})
