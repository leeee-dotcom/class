import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Portrait } from './Portrait'

/*
 * 그러데이션 참조(url(#...))는 인스턴스마다 id가 달라지므로 비교에서 뺀다.
 * 얼굴이 같은지는 실제 색값으로 판단한다.
 */
function colorFills(root: HTMLElement): string[] {
  const attributes = ['fill', 'stop-color', 'stroke']
  return [...root.querySelectorAll('*')].flatMap((node) =>
    attributes
      .map((name) => node.getAttribute(name))
      .filter((value): value is string => value?.startsWith('#') ?? false),
  )
}

describe('Portrait', () => {
  it('이름을 읽어주는 대체 텍스트를 붙인다', () => {
    render(<Portrait name="김나연" />)

    expect(screen.getByRole('img', { name: '김나연 얼굴 그림' })).toBeInTheDocument()
  })

  it('같은 이름이면 항상 같은 얼굴을 그린다', () => {
    const { container: first } = render(<Portrait name="김나연" />)
    const { container: second } = render(<Portrait name="김나연" />)

    // clipPath id만 인스턴스마다 달라지므로 색 조합으로 비교한다
    const fills = colorFills

    expect(fills(first)).toEqual(fills(second))
  })

  it('이름이 다르면 다른 얼굴이 나온다', () => {
    const { container: a } = render(<Portrait name="김나연" />)
    const { container: b } = render(<Portrait name="정민규" />)

    const fills = colorFills

    expect(fills(a)).not.toEqual(fills(b))
  })

  it('외부 이미지를 불러오지 않는다', () => {
    const { container } = render(<Portrait name="김나연" />)

    expect(container.querySelector('img')).toBeNull()
    expect(container.innerHTML).not.toContain('http')
  })
})
