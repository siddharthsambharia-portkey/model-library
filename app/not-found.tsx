import Link from 'next/link'
import Header from '@/components/Header'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg-base">
      <Header />
      
      <div className="pt-32 pb-16 px-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-8xl font-bold text-text-faint mb-6">404</div>
          <h1 className="display-md text-text-primary mb-4">
            Page not found
          </h1>
          <p className="body-md text-text-secondary mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link 
              href="/"
              className="btn btn-primary btn-lg w-full sm:w-auto"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link 
              href="/"
              className="btn btn-secondary btn-lg w-full sm:w-auto"
            >
              <Search className="w-4 h-4" />
              Browse Models
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
