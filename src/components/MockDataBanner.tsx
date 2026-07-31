import './MockDataBanner.css'

export const MOCK_DATA_NOTICE = '이 파일은 임시 파일이며 모두 가상으로 제작되었습니다.'

/**
 * 배포된 링크를 처음 여는 사람이 실제 학생 자료로 오해하지 않도록,
 * 모든 화면 최상단에 항상 붙어 있어야 한다. 닫기 버튼을 두지 않는 것이 요구사항이다.
 */
export function MockDataBanner() {
  return (
    <div className="mock-banner" role="note">
      {MOCK_DATA_NOTICE}
    </div>
  )
}
