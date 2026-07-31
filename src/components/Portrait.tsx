import { useId } from 'react'

/*
 * 학생 얼굴은 코드로 그린다. 실존 인물 사진을 쓰지 않고, 외부 이미지도 불러오지 않는다.
 * 사진처럼 보이도록 광원을 왼쪽 위에 두고 명암·홍조·눈동자 반사를 넣었지만,
 * 실제 사진이 아니라 벡터로 그린 가상 인물이다. 배포되는 시연물이라 이 구분은 유지한다.
 * 같은 이름은 항상 같은 얼굴이 되도록 이름 해시로 특징을 고른다.
 */

const SKIN = ['#f0d0b4', '#e6bd9e', '#d8a582', '#c08a67', '#9a6849']
const HAIR = ['#241a13', '#3b291d', '#54392a', '#15151b', '#6b4a2e']
const EYE = ['#3b2a1e', '#4a3b2a', '#2f2620']
const SHIRT = ['#3f6ea8', '#4f7d63', '#96566b', '#6a5c99', '#a87a3c', '#455e6b']
const BACKDROP = ['#dfe6ee', '#e2eae4', '#efe3e6', '#e5e2ef', '#efe8dc', '#dfe8ec']

/** 색을 밝게(+)/어둡게(-) 옮긴다. 명암은 색을 새로 고르지 않고 하나에서 파생시킨다. */
function shift(hex: string, amount: number): string {
  const value = parseInt(hex.slice(1), 16)
  const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255]
  return `#${channels
    .map((channel) => {
      const next = amount >= 0 ? channel + (255 - channel) * amount : channel * (1 + amount)
      return Math.round(Math.min(255, Math.max(0, next)))
        .toString(16)
        .padStart(2, '0')
    })
    .join('')}`
}

function hashOf(name: string): number {
  let hash = 2166136261
  for (const char of name) {
    hash ^= char.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash)
}

function pick<T>(hash: number, slot: number, options: T[]): T {
  return options[Math.floor(hash / 7 ** slot) % options.length]
}

/** 머리는 얼굴 뒤로 깔리는 덩어리와 이마를 덮는 앞머리로 나눠 그려야 두께가 생긴다. */
function hairPaths(style: number): { back: string | null; front: string } {
  switch (style) {
    case 0: // 짧은 머리
      return {
        back: null,
        front:
          'M28 46 C28 25 37 17 50 17 C63 17 72 25 72 46 C70 37 65 32 50 32 C35 32 30 37 28 46 Z',
      }
    case 1: // 단발
      return {
        back: 'M26 48 C26 24 36 16 50 16 C64 16 74 24 74 48 L74 70 C74 74 71 76 68 75 L68 44 C68 36 61 32 50 32 C39 32 32 36 32 44 L32 75 C29 76 26 74 26 70 Z',
        front: 'M29 45 C29 26 38 18 50 18 C62 18 71 26 71 45 C68 36 63 31 50 31 C37 31 32 36 29 45 Z',
      }
    case 2: // 하나로 묶은 머리
      return {
        back: 'M74 30 C81 31 84 38 82 45 C80 52 73 54 70 50 C74 44 75 36 74 30 Z',
        front:
          'M28 45 C28 25 37 17 50 17 C63 17 72 25 72 45 C70 36 65 31 50 31 C35 31 30 36 28 45 Z',
      }
    case 3: // 곱슬
      return {
        back: 'M25 44 C22 30 32 18 50 18 C68 18 78 30 75 44 C72 34 64 29 50 29 C36 29 28 34 25 44 Z',
        front:
          'M29 42 C31 34 36 30 42 32 C45 27 55 27 58 32 C64 30 69 34 71 42 C67 35 60 33 50 33 C40 33 33 35 29 42 Z',
      }
    case 4: // 긴 생머리
      return {
        back: 'M25 47 C25 23 36 15 50 15 C64 15 75 23 75 47 L75 88 L66 88 L66 43 C66 35 60 31 50 31 C40 31 34 35 34 43 L34 88 L25 88 Z',
        front: 'M30 44 C30 25 39 17 50 17 C61 17 70 25 70 44 C67 35 62 30 50 30 C38 30 33 35 30 44 Z',
      }
    default: // 아주 짧은 머리
      return {
        back: null,
        front:
          'M31 44 C31 30 39 23 50 23 C61 23 69 30 69 44 C67 37 62 34 50 34 C38 34 33 37 31 44 Z',
      }
  }
}

function Mouth({ style, lip }: { style: number; lip: string }) {
  const upper = shift(lip, -0.22)

  if (style === 0) {
    // 옅은 미소
    return (
      <g>
        <path d="M43 62 Q50 60.5 57 62 Q50 68 43 62 Z" fill={upper} />
        <path d="M43.5 62.4 Q50 61.4 56.5 62.4 Q50 67 43.5 62.4 Z" fill={lip} />
      </g>
    )
  }
  if (style === 1) {
    // 다문 입
    return (
      <g>
        <path d="M43 62 Q50 59.6 57 62 Q50 64.4 43 62 Z" fill={upper} />
        <path d="M43.6 62.3 Q50 64.6 56.4 62.3 Q50 66.4 43.6 62.3 Z" fill={lip} />
      </g>
    )
  }
  // 이가 살짝 보이는 미소
  return (
    <g>
      <path d="M42.5 61.5 Q50 59.6 57.5 61.5 Q50 69 42.5 61.5 Z" fill={upper} />
      <path d="M44.6 61.9 Q50 61 55.4 61.9 Q50 63.6 44.6 61.9 Z" fill="#f4efe9" />
      <path d="M44 64.4 Q50 63.4 56 64.4 Q50 68.4 44 64.4 Z" fill={lip} />
    </g>
  )
}

function Eye({ x, iris, lash }: { x: number; iris: string; lash: string }) {
  const side = x < 50 ? 1 : -1

  return (
    <g>
      {/* 흰자 */}
      <path
        d={`M${x - 6} 46 Q${x} 41.4 ${x + 6} 46 Q${x} 50.4 ${x - 6} 46 Z`}
        fill="#f6f1ec"
      />
      <circle cx={x + side * 0.3} cy="46" r="3.1" fill={iris} />
      <circle cx={x + side * 0.3} cy="46" r="2.9" fill={shift(iris, 0.18)} opacity="0.55" />
      <circle cx={x + side * 0.3} cy="46" r="1.45" fill="#171310" />
      <circle cx={x + side * 0.3 - 1} cy="44.9" r="0.85" fill="#ffffff" opacity="0.9" />
      {/* 윗눈꺼풀 선. 아래보다 두껍게 그려야 눈이 살아 보인다 */}
      <path
        d={`M${x - 6.2} 45.9 Q${x} 41 ${x + 6.2} 45.9`}
        stroke={lash}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${x - 5} 47.6 Q${x} 49.9 ${x + 5} 47.6`}
        stroke={lash}
        strokeWidth="0.55"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </g>
  )
}

type Props = {
  name: string
  className?: string
}

export function Portrait({ name, className }: Props) {
  const baseId = useId()
  const clipId = `${baseId}-clip`
  const skinId = `${baseId}-skin`
  const backdropId = `${baseId}-backdrop`

  const hash = hashOf(name)
  const skin = pick(hash, 0, SKIN)
  const hairColor = pick(hash, 1, HAIR)
  const hairStyle = Math.floor(hash / 7 ** 2) % 6
  const mouthStyle = Math.floor(hash / 7 ** 3) % 3
  const shirt = pick(hash, 4, SHIRT)
  const backdrop = pick(hash, 5, BACKDROP)
  const iris = pick(hash, 6, EYE)
  const glasses = Math.floor(hash / 7 ** 7) % 4 === 0

  const shadow = shift(skin, -0.16)
  const deepShadow = shift(skin, -0.3)
  const highlight = shift(skin, 0.16)
  const hairLight = shift(hairColor, 0.22)
  const hair = hairPaths(hairStyle)

  return (
    <svg className={className} viewBox="0 0 100 100" role="img" aria-label={`${name} 얼굴 그림`}>
      <defs>
        <clipPath id={clipId}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
        {/* 광원은 왼쪽 위. 모든 명암이 이 방향을 따른다 */}
        <radialGradient id={skinId} cx="0.38" cy="0.3" r="0.85">
          <stop offset="0" stopColor={highlight} />
          <stop offset="0.55" stopColor={skin} />
          <stop offset="1" stopColor={shadow} />
        </radialGradient>
        <radialGradient id={backdropId} cx="0.35" cy="0.28" r="0.9">
          <stop offset="0" stopColor={shift(backdrop, 0.35)} />
          <stop offset="1" stopColor={shift(backdrop, -0.18)} />
        </radialGradient>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <rect width="100" height="100" fill={`url(#${backdropId})`} />

        {hair.back && <path d={hair.back} fill={shift(hairColor, -0.18)} />}

        {/* 목: 턱 그림자를 위에 얹어야 머리가 목 위에 얹힌 것으로 보인다 */}
        <path d="M42 62 L58 62 L58 79 L42 79 Z" fill={shift(skin, -0.12)} />
        <path d="M42 62 Q50 72 58 62 L58 68 Q50 74 42 68 Z" fill={deepShadow} opacity="0.55" />

        {/* 어깨와 옷깃 */}
        <path d="M8 100 C10 85 26 77 50 77 C74 77 90 85 92 100 Z" fill={shirt} />
        <path d="M8 100 C10 88 20 81 32 78 L44 84 L38 100 Z" fill={shift(shirt, 0.1)} />
        <path d="M42 77 L50 87 L58 77 L64 79 L50 93 L36 79 Z" fill={shift(skin, -0.08)} />
        <path d="M42 77 L50 87 L58 77 L61 78 L50 90 L39 78 Z" fill={shift(shirt, -0.22)} />

        {/* 귀 */}
        <ellipse cx="29.5" cy="47" rx="3.6" ry="5.2" fill={shadow} />
        <ellipse cx="70.5" cy="47" rx="3.6" ry="5.2" fill={shift(skin, -0.22)} />

        {/* 얼굴: 광대에서 턱으로 좁아지는 윤곽 */}
        <path
          d="M31 43 C31 27 39 20 50 20 C61 20 69 27 69 43 C69 53 66 62 60 68 C56 71.6 53 73 50 73 C47 73 44 71.6 40 68 C34 62 31 53 31 43 Z"
          fill={`url(#${skinId})`}
        />
        {/* 오른쪽 면 그림자 */}
        <path
          d="M58 24 C66 28 69 34 69 43 C69 53 66 62 60 68 C57 70.6 54 72.6 50 73 C55 68 60 58 61 46 C62 37 60 29 58 24 Z"
          fill={deepShadow}
          opacity="0.35"
        />
        {/* 홍조 */}
        <ellipse cx="38.5" cy="55" rx="5.5" ry="3.4" fill="#d4726a" opacity="0.16" />
        <ellipse cx="61.5" cy="55" rx="5.5" ry="3.4" fill="#d4726a" opacity="0.13" />

        {/* 코: 콧대 하이라이트 + 콧방울 그림자 */}
        <path d="M49.4 46 Q48.6 53 47.4 56.6" stroke={highlight} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.7" />
        <path
          d="M46.6 57.2 Q50 59.4 53.4 57.2 Q52.4 54 50 53.6 Q47.6 54 46.6 57.2 Z"
          fill={shadow}
          opacity="0.65"
        />
        <ellipse cx="47.2" cy="57.4" rx="0.85" ry="0.6" fill={deepShadow} />
        <ellipse cx="52.8" cy="57.4" rx="0.85" ry="0.6" fill={deepShadow} />

        {hair.front && <path d={hair.front} fill={hairColor} />}
        {/* 머리 하이라이트 */}
        <path
          d="M35 33 C39 27 45 24 51 24 C46 26 41 30 38 36 Z"
          fill={hairLight}
          opacity="0.55"
        />

        {/* 눈썹 */}
        <path
          d="M35.5 39.6 Q41 36.4 46.5 39"
          stroke={shift(hairColor, 0.08)}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M53.5 39 Q59 36.4 64.5 39.6"
          stroke={shift(hairColor, 0.08)}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        <Eye x={41} iris={iris} lash={shift(hairColor, -0.1)} />
        <Eye x={59} iris={iris} lash={shift(hairColor, -0.1)} />

        <Mouth style={mouthStyle} lip="#b56b62" />

        {glasses && (
          <g stroke="#39414d" strokeWidth="1.5" fill="none" opacity="0.9">
            <rect x="33.5" y="41" width="15" height="10.5" rx="4" />
            <rect x="51.5" y="41" width="15" height="10.5" rx="4" />
            <path d="M48.5 45.5 H51.5" />
            <path d="M33.5 45 L29 44.5" />
            <path d="M66.5 45 L71 44.5" />
          </g>
        )}

        {/* 가장자리를 살짝 눌러 사진 같은 깊이를 준다 */}
        <circle cx="50" cy="50" r="49" fill="none" stroke="#000000" strokeWidth="2" opacity="0.07" />
      </g>
    </svg>
  )
}
