import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="min-h-[calc(100vh-200px)]">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
