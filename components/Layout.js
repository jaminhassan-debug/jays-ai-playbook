import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-primary">
      <Header />
      <main className="container mx-auto p-4">
        {children}
      </main>
      <Footer />
    </div>
  )
}