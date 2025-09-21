import { Button } from '@/Components/ui/button'
import ThemeToggle from './ThemeToggle'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, signOut } = useAuth()
  const navigate = useNavigate()
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background/70 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-rose-500 text-white font-bold">KS</span>
          <span className="font-semibold text-rose-500">Kata Sweet Shop</span>
        </Link>
        {!isAuthenticated && (
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/#features" className="hover:text-rose-600 transition-colors">Features</Link>
            <Link to="/#contact" className="hover:text-rose-600 transition-colors">Contact</Link>
          </nav>
        )}
        <div className="flex items-center gap-3">
          {!isAuthenticated && (
            <>
              <div className="hidden sm:inline-flex">
                <Button variant="outline" asChild>
                  <Link to="/signin">Log in</Link>
                </Button>
              </div>
              <Button asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
          {isAuthenticated && (
            <Button
              className="bg-rose-500 text-white hover:bg-rose-600"
              onClick={() => {
                signOut()
                navigate('/')
              }}
            >
              Sign out
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
