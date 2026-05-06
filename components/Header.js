import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-primary p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-text">
          Jay's AI Playbook
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-white hover:text-text">Home</Link>
          <Link href="/products" className="text-white hover:text-text">Products</Link>
          <Link href="/prompts" className="text-white hover:text-text">Prompts</Link>
        </div>
      </nav>
    </header>
  )
}