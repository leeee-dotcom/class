import { Link, Route, Routes } from 'react-router-dom'
import { MockDataBanner } from './components/MockDataBanner'
import { Sidebar } from './components/Sidebar'
import { HomePage } from './pages/HomePage'
import { StudentDetailPage } from './pages/StudentDetailPage'
import './App.css'

function NotFound() {
  return (
    <div className="app__notfound">
      <p>페이지를 찾을 수 없습니다.</p>
      <Link to="/">첫 화면으로 돌아가기</Link>
    </div>
  )
}

export default function App() {
  return (
    <div className="shell">
      <MockDataBanner />
      <div className="app">
        <Sidebar />
        <div className="app__main">
          <header className="app__header">
            <h1 className="app__title">진로중학교 학생 진로 설계 자료</h1>
            <p className="app__subtitle">3학년 3반 · 학생 한 명씩 함께 보며 논의합니다</p>
          </header>
          <main className="app__content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/students/:id" element={<StudentDetailPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}
