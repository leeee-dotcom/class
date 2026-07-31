# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 이 저장소의 성격

교사 회의에서 학생을 한 명씩 띄워 놓고 논의하는 방식을 보여주는 **안내용 시연물**입니다. 실제 학생 관리 도구가 아닙니다. 화면은 읽기 전용이고 아무것도 저장하지 않습니다.

## 절대 어기면 안 되는 것

1. **학생 데이터는 전부 가상이어야 합니다.** `leeee-dotcom/class` 는 **public 저장소**이고 사이트도 공개돼 있습니다. 성적·성격·교우관계·진로검사 결과는 미성년자의 민감정보라, 실제 값을 넣는 순간 공개 유출이 됩니다. 저장소 비공개 전환 + 인증 + Supabase RLS가 **먼저** 잡히기 전에는 실제 데이터를 넣지 마세요 (README "실제 학생 데이터를 쓰고 싶어지면" 참고).
2. **최상단 배너 문구를 바꾸거나 없애지 마세요** — `이 파일은 임시 파일이며 모두 가상으로 제작되었습니다.` `MockDataBanner` 에 상수로 있고 닫기 버튼이 없습니다. 배포된 링크를 처음 여는 사람이 실제 자료로 오해하는 것을 막는 장치라 장식이 아닙니다. 테스트가 이 문구를 못 박고 있습니다.
3. **외부 이미지·실존 인물 사진을 쓰지 마세요.** 얼굴은 `Portrait.tsx` 가 이름 해시로 그리는 인라인 SVG입니다. 네트워크 요청 0건.

## 명령

```bash
npm run dev                                  # 개발 서버 (5173)
npm test                                     # 전체 테스트 (vitest run)
npx vitest run src/components/GradeTable.test.tsx    # 파일 하나만
npx vitest run -t "직전 학기보다 오르면"              # 이름으로 하나만
npx vitest                                   # watch 모드
npm run lint                                 # oxlint
npm run build                                # tsc -b + vite build (루트 base) — Vercel용
npm run build:pages                          # --base=/class/ + 404.html + .nojekyll — GitHub Pages용
npm run preview                              # 빌드 결과 확인
```

`npm run build` 의 `tsc -b` 가 타입체크입니다. 별도 typecheck 스크립트는 없습니다.

## 구조에서 알아야 할 것

### 데이터 경계 — `src/data/studentRepo.ts`

화면이 데이터 출처를 모르게 하는 **유일한 통로**입니다. 지금은 로컬 배열을 돌려주지만 반환이 `Promise` 라, Supabase(`src/lib/supabase.ts`, 준비만 돼 있고 연결 안 됨)로 갈아끼울 때 이 파일 내부만 고치면 됩니다.

**화면 컴포넌트가 `students.ts` 를 직접 import 하면 이 경계가 깨집니다.** 페이지는 `loading / ready / notFound` 세 상태를 이미 처리하고 있으니 비동기 전환 후에도 그대로 유효합니다.

### 계산 로직 — `src/data/studentStats.ts`

요약 타일과 첫 화면 숫자(잘하는/약한 과목, 오른/떨어진 과목, 반 요약)를 전부 여기서 계산합니다. 컴포넌트에 계산을 다시 심지 말고 여기에 함수를 더하세요. 테스트가 붙어 있습니다.

### 학생 데이터 — `src/data/students.ts`

**표본 5명**만 둡니다 (3학년 3반, 학번 30301–30305, 2학년 1학기 ~ 3학년 1학기). 성적이 오른 학생·떨어진 학생·과목 편차가 큰 학생을 의도적으로 섞어 회의에서 나올 만한 경우를 덮습니다. 시연물이라 이 다양성이 곧 설득력이므로, 학생을 더할 때도 이 성격을 유지하세요. 배열에만 추가하면 화면은 그대로 동작합니다.

`Student` 에 필수 필드를 추가하면 테스트 픽스처(`StudentNav.test.tsx`, `studentStats.test.ts`)에서 TS2741이 납니다 — 픽스처도 같이 채워야 빌드가 통과합니다.

### 디자인 토큰 — `src/styles/tokens.css`

색·크기·여백이 전부 여기 있고 컴포넌트 CSS는 이 변수만 씁니다. 규칙:

- 강조색은 Action Blue(`--action`) 하나. 보조 브랜드색을 두지 않습니다
- **그림자 없음.** 깊이는 1px 헤어라인과 여백으로 만듭니다
- 굵기는 300/400/600/700 (500은 쓰지 않음)
- 크기를 px로 고정하지 않고 `clamp()` 로 화면 너비에 따라 자라게 둡니다 — 전자칠판 한 화면에 들어가야 하기 때문입니다. 글자가 작게 느껴지면 컴포넌트가 아니라 여기를 고치세요
- 성적 변화는 **초록↔빨강을 쓰지 않습니다.** 적록색약에서 ΔE 4.5로 붙어버립니다. `--up`(Action Blue) ↔ `--down`(주홍)이 ΔE 26.4로 안전하고, ▲▼ 기호와 숫자를 함께 써서 색 없이도 읽히게 합니다

### 전자칠판 모드 — `src/App.css`

`@media (min-width: 1200px) and (min-height: 680px)` 안에서 셸이 `100dvh` 로 고정되고 `.card__body` 만 스크롤합니다. 큰 화면에서 페이지 전체가 스크롤되면 이 규칙이 깨진 것입니다.

### 상세 화면 배치 — `src/pages/StudentDetailPage.tsx`

머리말(얼굴 / 이름·학번·학생이동 / 요약 타일 4개) 아래 4단: **성적**(추이 차트 + 성적표, 가장 넓음) · **성격·교우관계** · **진로** · **고등학교**. 요약 타일의 진로/고등학교는 `SummaryPair` 가 **희망 vs 추천**을 위아래로 붙여 보여줍니다 — 회의의 논점이 늘 그 둘의 거리라서입니다. 열 너비는 `StudentDetailPage.css` 의 `.detail__columns` grid-template-columns 와 1600/1240px 중단점에 있습니다.

### 회의 흐름

좌우 화살표 키로 학생을 넘깁니다(`StudentNav`). 진행 교사가 클릭 없이 진행하기 위한 것이고, 검색창에 입력 중일 때는 키를 가로채지 않습니다.

## 배포

라우터의 `basename` 이 `import.meta.env.BASE_URL` 을 따르므로 **두 배포 방식이 같은 코드를 씁니다.**

- **GitHub Pages** (현재 운영: https://leeee-dotcom.github.io/class/) — `npm run build:pages` 후 `dist/` 를 `gh-pages` 브랜치에 올립니다. 이 저장소는 `gh-pages` 를 추적하지 않고, `dist/` 안에 별도 git 저장소를 만들어 force push하는 방식으로 올렸습니다. **GitHub Actions 워크플로 파일은 쓸 수 없습니다** — 이 환경의 `gh` 토큰에 `workflow` 스코프가 없어 푸시가 거부됩니다.
- **Vercel** — `npm run build`. `vercel.json` 의 rewrite가 딥링크를 처리합니다.

**Pages에서 딥링크가 HTTP 404를 내는 것은 정상입니다.** Pages에는 rewrite가 없어서, 없는 경로에 돌려주는 `404.html` 을 `index.html` 과 같게 두는 방식(`scripts/pages-fallback.js`)을 씁니다. 응답 코드만 404이고 앱은 정상적으로 뜨며 라우터가 주소를 읽습니다. 검색 노출은 `index.html` 의 `noindex` 로 막혀 있어 문제되지 않습니다. **이걸 버그로 보고 고치려 들지 마세요.**

`dist/` 는 두 빌드가 같은 자리를 쓰므로, Pages에 다시 올리기 전에 반드시 `npm run build:pages` 를 먼저 돌리세요 (루트 base 빌드가 남아 있으면 자산 경로가 깨집니다).

## Windows 환경 주의

- 커밋 메시지는 here-string이 PowerShell 5.1에서 깨지므로 `git commit -F <파일>` 로 넘기세요
- HTTP 확인은 `Invoke-WebRequest` 대신 `curl` 을 쓰세요 — PowerShell의 `GetResponseStream()` 이 빈 본문을 돌려줘 배포를 실패로 오판한 적이 있습니다
