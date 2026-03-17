import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar.jsx'
import { ScrollToTop } from './ScrollToTop.jsx'

export function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </>
  )
}

