import { useId } from 'react'
import type { ReactNode } from 'react'
import './Card.css'

type Props = {
  title: string
  /** 제목 옆에 붙는 짧은 보조 설명 */
  note?: string
  children: ReactNode
}

export function Card({ title, note, children }: Props) {
  const titleId = useId()

  return (
    <section className="card" aria-labelledby={titleId}>
      <header className="card__header">
        <h2 className="card__title" id={titleId}>
          {title}
        </h2>
        {note && <p className="card__note">{note}</p>}
      </header>
      <div className="card__body">{children}</div>
    </section>
  )
}
