import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/Components/ui/button'
import { useAuth } from '@/context/AuthContext'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'
      const resp = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (!resp.ok) {
        const text = await resp.json()
        throw new Error(text.message || `Request failed: ${resp.status}`)
      }
      const data = await resp.json()
      signIn(data.token, data.user)
      navigate('/')
    } catch (err: any) {
      setError(err?.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] scroll-mt-24 grid place-items-center px-4">
      <h1 className='bg-rose-400 px-3 py-1 rounded-xl relative top-20'>Note: This feature might not work due to the expiration of the free database hosting</h1>

      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Join and manage your sweet shop.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>
          {error && <div className="text-sm text-destructive">{error}</div>}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Sign up'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/signin" className="underline underline-offset-4 hover:text-rose-500">Sign in</Link>
        </p>
      </div>
    </section>
  )
}
