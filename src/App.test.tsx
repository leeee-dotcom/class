import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'
import { MOCK_DATA_NOTICE } from './components/MockDataBanner'

/*
 * 배포된 링크를 처음 여는 사람이 실제 학생 자료로 오해하지 않게 하는 것이 이 프로젝트의
 * 필수 요구사항이다. 어떤 경로에서도 배너가 사라지면 안 되므로 테스트로 못 박아 둔다.
 */
const routes = ['/', '/students/s01', '/students/없는-학생', '/아무-경로']

describe('안내 배너', () => {
  it.each(routes)('%s 에서도 가상 데이터 안내가 보인다', (route) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByText(MOCK_DATA_NOTICE)).toBeInTheDocument()
  })
})
