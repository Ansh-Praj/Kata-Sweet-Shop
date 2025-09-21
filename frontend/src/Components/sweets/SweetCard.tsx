import type { Sweet } from './SweetTypes'

type Props = {
  sweet: Sweet
  isAdmin: boolean
  // buy
  desired: number
  onDesiredChange: (val: number) => void
  buying: boolean
  onBuy: () => void
  // restock
  restockAmount: number
  onRestockAmountChange: (val: number) => void
  restocking: boolean
  onRestock: () => void
  // edit
  onEdit?: () => void
  onDelete?: () => void
}

// API helpers for actions related to a single sweet
export async function purchaseSweet(
  token: string,
  sweetId: string,
  quantity: number,
) {
  const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'
  const resp = await fetch(`${BASE_URL}/api/sweets/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sweetId, quantity }),
  })
  if (!resp.ok) {
    const raw = await resp.text()
    let msg = ''
    try { msg = raw ? JSON.parse(raw)?.message : '' } catch {}
    throw new Error(msg || raw || `Purchase failed: ${resp.status}`)
  }
}

export async function restockSweet(
  token: string,
  sweet: Sweet,
  addQuantity: number,
) {
  const payload = {
    name: sweet.name,
    price: Number(sweet.price),
    quantity: Number((sweet.quantity ?? 0) + addQuantity),
    category: sweet.category ?? '',
    imageUrl: sweet.imageUrl,
  }
  const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'
  const resp = await fetch(`${BASE_URL}/api/sweets/${sweet.id}`, {
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
    throw new Error(msg || raw || `Failed to restock: ${resp.status}`)
  }
}

export async function deleteSweet(token: string, id: string) {
  const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'
  const resp = await fetch(`${BASE_URL}/api/sweets/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!resp.ok) {
    const raw = await resp.text()
    let msg = ''
    try { msg = raw ? JSON.parse(raw)?.message : '' } catch {}
    throw new Error(msg || raw || `Failed to delete sweet: ${resp.status}`)
  }
}

export default function SweetCard({
  sweet,
  isAdmin,
  desired,
  onDesiredChange,
  buying,
  onBuy,
  restockAmount,
  onRestockAmountChange,
  restocking,
  onRestock,
  onEdit,
  onDelete,
}: Props) {
  const overDesired = typeof sweet.quantity === 'number' && desired > sweet.quantity
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
      <img src={sweet.imageUrl} alt={sweet.name} className="w-full h-48 object-cover rounded-t-xl" />
      <div className="flex items-baseline justify-between mt-2">
        <h3 className="font-semibold text-foreground">{sweet.name}</h3>
        <span className="text-sm text-muted-foreground">₹{sweet.price}</span>
      </div>
      {sweet.category && (
        <div className="mt-1">
          <span className="inline-flex items-center rounded-md bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 px-2 py-0.5 text-xs">
            {sweet.category}
          </span>
        </div>
      )}
      {typeof sweet.quantity === 'number' && (
        <div className="mt-2 text-sm text-muted-foreground">Quantity: {sweet.quantity}</div>
      )}
      <div className="mt-3 flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={desired}
          onChange={(e) => onDesiredChange(Number(e.target.value))}
          className="w-20 rounded-md border border-input bg-background px-2 py-1 text-sm"
        />
        <button
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-rose-500 text-white hover:bg-rose-600 h-9 px-3"
          disabled={buying || overDesired || desired < 1}
          onClick={onBuy}
        >
          {buying ? 'Buying…' : 'Buy'}
        </button>
      </div>

      {isAdmin && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            min={1}
            placeholder="Add qty"
            value={restockAmount}
            onChange={(e) => onRestockAmountChange(Number(e.target.value))}
            className="w-24 rounded-md border border-input bg-background px-2 py-1 text-sm"
          />
          <button
            onClick={onRestock}
            disabled={restocking}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-emerald-500 text-white hover:bg-emerald-600 h-9 px-3"
          >
            {restocking ? 'Restocking…' : 'Restock'}
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="ml-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-muted h-9 px-3"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-rose-400 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 h-9 px-3"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}
