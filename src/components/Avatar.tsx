import { Portrait } from './Portrait'
import './Avatar.css'

/*
 * photoUrl 이 있으면 사진을, 없으면 코드로 그린 초상을 쓴다.
 * 가상 학생이므로 지금은 모두 초상 쪽이다.
 */

type Props = {
  name: string
  photoUrl?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ name, photoUrl, size = 'md' }: Props) {
  if (photoUrl) {
    return <img className={`avatar avatar--${size}`} src={photoUrl} alt={`${name} 사진`} />
  }

  return <Portrait name={name} className={`avatar avatar--${size}`} />
}
