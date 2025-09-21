export type SweetsFilter = {
  name: string
  category: string
  startPrice: string
  endPrice: string
}

import { type Sweet } from './SweetTypes'

type Props = {
  values: SweetsFilter
  onChange: (patch: Partial<SweetsFilter>) => void
  onSearch: () => void
  onReset: () => void
  disabled?: boolean
}

export default function SweetsFilters({ values, onChange, onSearch, onReset, disabled }: Props) {
  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="f-name">Name</label>
          <input
            id="f-name"
            type="text"
            value={values.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g., Barfi"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="f-category">Category</label>
          <input
            id="f-category"
            type="text"
            value={values.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g., Maharashtra"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="f-start">Start Price</label>
          <input
            id="f-start"
            type="number"
            min={0}
            step="0.01"
            value={values.startPrice}
            onChange={(e) => onChange({ startPrice: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g., 10"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="f-end">End Price</label>
          <input
            id="f-end"
            type="number"
            min={0}
            step="0.01"
            value={values.endPrice}
            onChange={(e) => onChange({ endPrice: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g., 100"
            disabled={disabled}
          />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-rose-500 text-white hover:bg-rose-600 h-9 px-4"
          onClick={onSearch}
          disabled={disabled}
        >
          Search
        </button>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-muted h-9 px-4"
          onClick={onReset}
          disabled={disabled}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

// Helper: perform search call using provided filters and token, returns sweets array
export async function handleSearch(filters: SweetsFilter, token: string | null): Promise<Sweet[]> {
  if (!token) return []
  const params = new URLSearchParams()
  if (filters.name.trim()) params.set('name', filters.name.trim())
  if (filters.category.trim()) params.set('category', filters.category.trim())
  if (filters.startPrice.trim()) params.set('startPrice', String(Number(filters.startPrice)))
  if (filters.endPrice.trim()) params.set('endPrice', String(Number(filters.endPrice)))
  const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'
  const resp = await fetch(`${BASE_URL}/api/sweets/search?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!resp.ok) {
    const raw = await resp.text()
    throw new Error(raw || `Search failed: ${resp.status}`)
  }
  const json = await resp.json()
  const data: Sweet[] = Array.isArray(json)
    ? json
    : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json?.sweets)
        ? json.sweets
        : []
  return data
}
