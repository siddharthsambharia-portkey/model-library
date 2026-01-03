import Link from 'next/link'
import Header from '@/components/Header'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <Header />
      
      <div className="pt-32 px-8 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-8xl font-bold text-text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Page Not Found
          </h2>
          <p className="text-text-secondary mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link 
            href="/"
            className="btn btn-primary"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}

