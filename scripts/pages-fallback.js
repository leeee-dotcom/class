import { copyFileSync, writeFileSync } from 'node:fs'

/*
 * GitHub Pages는 Vercel의 rewrite 같은 기능이 없어서 /class/students/s02 로 직접 들어오면
 * 파일을 못 찾고 404.html 을 돌려준다. 그 404.html 을 index.html 과 같은 내용으로 두면
 * 앱이 그대로 뜨고 라우터가 주소를 읽어 올바른 화면을 그린다. (응답 코드만 404이고
 * 화면은 정상이다. 검색 노출은 noindex 로 막아두었으므로 문제되지 않는다.)
 *
 * .nojekyll 은 Jekyll 처리를 꺼서 _ 로 시작하는 자산이 무시되지 않게 한다.
 */
copyFileSync('dist/index.html', 'dist/404.html')
writeFileSync('dist/.nojekyll', '')

console.log('GitHub Pages 대비: dist/404.html, dist/.nojekyll 생성')
