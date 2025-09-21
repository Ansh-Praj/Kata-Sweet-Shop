import React from 'react'

export type EditSweetForm = {
  name: string
  price: string
  quantity: string
  category: string
  imageUrl: string
}

// API helper: update a sweet by id
export async function updateSweet(token: string, id: string, form: EditSweetForm) {
  const payload = {
    name: form.name.trim(),
    price: Number(form.price),
    quantity: Number(form.quantity),
    category: form.category.trim(),
    imageUrl: form.imageUrl.trim(),
  }
  const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'
  const resp = await fetch(`${BASE_URL}/api/sweets/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  if (!resp.ok) {
    const raw = await resp.text()
    let msg = ''
    try { msg = raw ? JSON.parse(raw)?.message : '' } catch {}
    throw new Error(msg || raw || `Failed to update sweet: ${resp.status}`)
  }
  return payload
}

type Props = {
  editing: boolean
  form: EditSweetForm
  onChange: (patch: Partial<EditSweetForm>) => void
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export default function EditSweetModal({ editing, form, onChange, onClose, onSubmit }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Sweet</h2>
          <button
            className="rounded-md px-2 py-1 text-sm hover:bg-muted"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="edit-name">Name</label>
            <input
              id="edit-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="edit-price">Price</label>
              <input
                id="edit-price"
                type="number"
                step="0.01"
                min={0}
                required
                value={form.price}
                onChange={(e) => onChange({ price: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="edit-qty">Quantity</label>
              <input
                id="edit-qty"
                type="number"
                min={0}
                required
                value={form.quantity}
                onChange={(e) => onChange({ quantity: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="edit-category">Category</label>
            <input
              id="edit-category"
              type="text"
              required
              value={form.category}
              onChange={(e) => onChange({ category: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="edit-image">Image URL</label>
            <input
              id="edit-image"
              type="url"
              required
              value={form.imageUrl}
              onChange={(e) => onChange({ imageUrl: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-muted h-9 px-3"
              onClick={onClose}
              disabled={editing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-rose-500 text-white hover:bg-rose-600 h-9 px-4"
              disabled={editing}
            >
              {editing ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
