import './App.css'
import AnnouncementsPage from './pages/announcements'
import AnnouncementEditPage from './pages/announcementEdit'

function App() {
  const pathname = window.location.pathname
  const isAnnouncementsPath = pathname === '/announcements' || pathname === '/annoucements'
  const editPathMatch = pathname.match(/^\/announcements\/([^/]+)$/) ?? pathname.match(/^\/annoucements\/([^/]+)$/)

  if (editPathMatch) {
    return <AnnouncementEditPage id={decodeURIComponent(editPathMatch[1])} />
  }

  if (isAnnouncementsPath) {
    return <AnnouncementsPage />
  }

  return (
    <main className="main-link-page">
      <a href="/announcements" className="main-link">
        Go to announcements
      </a>
    </main>
  )
}

export default App
