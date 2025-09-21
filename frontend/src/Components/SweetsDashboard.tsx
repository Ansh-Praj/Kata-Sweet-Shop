import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import SweetCard, { purchaseSweet, restockSweet, deleteSweet } from './sweets/SweetCard'
import AddSweetModal, { type AddSweetForm, addSweet } from './sweets/AddSweetModal'
import EditSweetModal, { type  EditSweetForm, updateSweet } from './sweets/EditSweetModal'
import { type Sweet } from './sweets/SweetTypes'
import SweetsFilters, { type SweetsFilter, handleSearch as searchSweets } from './sweets/SweetsFilters'

// Removed dependency on '@/lib/api' and defined a shared Sweet type in ./sweets/SweetTypes

export default function SweetsDashboard() {
  const { token, user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [sweets, setSweets] = useState<Sweet[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [desired, setDesired] = useState<Record<string, number>>({})
  const [buyingId, setBuyingId] = useState<string | null>(null)

  // admin: add sweet modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<AddSweetForm>({
    name: '',
    price: '',
    quantity: '',
    category: '',
    imageUrl: '',
  })

  // admin: edit sweet modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditSweetForm>({
    name: '',
    price: '',
    quantity: '',
    category: '',
    imageUrl: '',
  })
  const [editing, setEditing] = useState(false)

  // admin: restock state
  const [restockBy, setRestockBy] = useState<Record<string, number>>({})
  const [restockingId, setRestockingId] = useState<string | null>(null)

  // filters/search state
  const [filters, setFilters] = useState<SweetsFilter>({
    name: '',
    category: '',
    startPrice: '',
    endPrice: '',
  })
  const [searching, setSearching] = useState(false)

  async function doSearch() {
    if (!token) return
    setSearching(true)
    setError(null)
    try {
      const data = await searchSweets(filters, token)
      setSweets(data)
    } catch (e: any) {
      setError(e?.message || 'Failed to search sweets')
    } finally {
      setSearching(false)
    }
  }
  // Admin: delete a sweet
  async function handleDelete(id: string) {
    if (!token) return
    const confirm = window.confirm('Are you sure you want to delete this sweet?')
    if (!confirm) return
    setError(null)
    try {
      await deleteSweet(token, id)
      setSweets((prev) => (prev ?? []).filter((x) => x.id !== id))
      if (editingId === id) {
        setShowEditModal(false)
        setEditingId(null)
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to delete sweet')
    }
  }

  async function handleReset() {
    setFilters({ name: '', category: '', startPrice: '', endPrice: '' })
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'
      const resp = await fetch(`${BASE_URL}/api/sweets`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!resp.ok) {
        const raw = await resp.text()
        throw new Error(raw || `Request failed: ${resp.status}`)
      }
      const json = await resp.json()
      const data: Sweet[] = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json?.sweets)
            ? json.sweets
            : []
      setSweets(data)
    } catch (e: any) {
      setError(e?.message || 'Failed to load sweets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    async function run() {
      if (!token) return
      setLoading(true)
      try {
        const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'
        const resp = await fetch(`${BASE_URL}/api/sweets`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
        if (!resp.ok) {
          const text = await resp.text()
          throw new Error(text || `Request failed: ${resp.status}`)
        }
        const json = await resp.json()
        const data: Sweet[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json?.sweets)
              ? json.sweets
              : []
        if (mounted) setSweets(data)
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load sweets')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => { mounted = false }
  }, [token])

  const getDesired = (id: string) => (desired[id] ?? 1)

  async function handleBuy(id: string) {
    if (!token || !sweets) return
    const sweet = sweets.find((x) => x.id === id)
    if (!sweet) return
    const qty = Math.max(1, Math.floor(getDesired(id)))
    if (typeof sweet.quantity === 'number' && qty > sweet.quantity) {
      setError(`Not enough stock for ${sweet.name}. Available: ${sweet.quantity}`)
      return
    }
    setError(null)
    setBuyingId(id)
    try {
      await purchaseSweet(token, id, qty)
      // Optimistically update local stock
      setSweets((prev) =>
        (prev ?? []).map((s) =>
          s.id === id && typeof s.quantity === 'number'
            ? { ...s, quantity: s.quantity - qty }
            : s
        )
      )
    } catch (e: any) {
      setError(e?.message || 'Failed to complete purchase')
    } finally {
      setBuyingId(null)
    }
  }

  // Admin: submit add sweet
  async function handleAddSweet(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    setAdding(true)
    setError(null)
    try {
      const created = await addSweet(token, form)
      // Refresh or optimistically add. We'll optimistically add minimal data.
      setSweets((prev) => ([
        ...(prev ?? []),
        {
          id: String(created?.id ?? Date.now()), // fallback temp id
          name: created?.name ?? form.name.trim(),
          price: created?.price ?? Number(form.price),
          quantity: created?.quantity ?? Number(form.quantity),
          imageUrl: created?.imageUrl ?? form.imageUrl.trim(),
          category: created?.category ?? form.category.trim(),
        },
      ]))
      setShowAddModal(false)
      setForm({ name: '', price: '', quantity: '', category: '', imageUrl: '' })
    } catch (e: any) {
      setError(e?.message || 'Failed to add sweet')
    } finally {
      setAdding(false)
    }
  }

  // Admin: open edit sweet modal prefilled
  function openEditModal(s: Sweet) {
    setEditingId(s.id)
    setEditForm({
      name: s.name,
      price: String(s.price),
      quantity: String(s.quantity ?? 0),
      category: s.category ?? '',
      imageUrl: s.imageUrl,
    })
    setShowEditModal(true)
  }

  // Admin: submit edit sweet
  async function handleEditSweet(e: React.FormEvent) {
    e.preventDefault()
    if (!token || !editingId) return
    setEditing(true)
    setError(null)
    try {
      const payload = await updateSweet(token, editingId, editForm)
      // Optimistically update list
      setSweets((prev) => (prev ?? []).map((x) => (
        x.id === editingId
          ? { ...x, ...payload }
          : x
      )))
      setShowEditModal(false)
      setEditingId(null)
    } catch (e: any) {
      setError(e?.message || 'Failed to update sweet')
    } finally {
      setEditing(false)
    }
  }

  // Admin: restock an item by a given amount
  async function handleRestock(s: Sweet) {
    if (!token) return
    const add = Math.max(1, Math.floor(restockBy[s.id] ?? 1))
    setRestockingId(s.id)
    setError(null)
    try {
      await restockSweet(token, s, add)
      setSweets((prev) =>
        (prev ?? []).map((x) =>
          x.id === s.id
            ? { ...x, quantity: (x.quantity ?? 0) + add }
            : x
        )
      )
      setRestockBy((r) => ({ ...r, [s.id]: 1 }))
    } catch (e: any) {
      setError(e?.message || 'Failed to restock')
    } finally {
      setRestockingId(null)
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="my-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome{user?.name ? `, ${user.name}` : ''} 👋</h1>
          <p className="text-muted-foreground">Here are your sweets from {isAdmin ? 'the backend' : 'all over India'}.</p>
        </div>
        {isAdmin && (
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-rose-500 text-white hover:bg-rose-600 h-9 px-3"
            onClick={() => setShowAddModal(true)}
          >
            Add Sweet
          </button>
        )}
      </div>
      {/* Filters */}
      <SweetsFilters
        values={filters}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        onSearch={doSearch}
        onReset={handleReset}
        disabled={loading || searching}
      />
      {loading && <div className="text-muted-foreground">Loading sweets…</div>}
      {error && <div className="text-destructive">{error}</div>}
      {!loading && !error && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(sweets ?? []).map((s) => (
            <SweetCard
              key={s.id}
              sweet={s}
              isAdmin={isAdmin}
              desired={getDesired(s.id)}
              onDesiredChange={(val) =>
                setDesired((d) => ({ ...d, [s.id]: isNaN(val) || val < 1 ? 1 : Math.floor(val) }))
              }
              buying={buyingId === s.id}
              onBuy={() => handleBuy(s.id)}
              restockAmount={restockBy[s.id] ?? 1}
              onRestockAmountChange={(val) =>
                setRestockBy((r) => ({ ...r, [s.id]: isNaN(val) || val < 1 ? 1 : Math.floor(val) }))
              }
              restocking={restockingId === s.id}
              onRestock={() => handleRestock(s)}
              onEdit={() => openEditModal(s)}
              onDelete={() => handleDelete(s.id)}
            />
          ))}
          {(sweets ?? []).length === 0 && (
            <div className="col-span-full text-muted-foreground">No sweets found.</div>
          )}
        </div>
      )}

      {isAdmin && showAddModal && (
        <AddSweetModal
          adding={adding}
          form={form}
          onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSweet}
        />
      )}

      {isAdmin && showEditModal && editingId && (
        <EditSweetModal
          editing={editing}
          form={editForm}
          onChange={(patch) => setEditForm((f) => ({ ...f, ...patch }))}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditSweet}
        />
      )}
    </section>
  )
}
