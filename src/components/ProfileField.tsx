import type { ReactNode } from 'react'
import './ProfileField.css'

type Props = {
  label: string
  /** 회의에서 먼저 읽혀야 하는 항목. 붉은 테두리 상자로 감싸고 본문을 굵게 쓴다 */
  highlight?: boolean
  children: ReactNode
}

export function ProfileField({ label, highlight = false, children }: Props) {
  return (
    <div className={highlight ? 'profile-field profile-field--highlight' : 'profile-field'}>
      <div className="profile-field__label">{label}</div>
      <div className="profile-field__body">{children}</div>
    </div>
  )
}
