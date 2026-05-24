"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  X,
  Search,
  AlertCircle,
  Check,
  ChevronDown,
  TrendingUp,
  Archive,
  Layers,
  Loader2,
  Eye,
  DollarSign,
  Package,
  Truck,
  MapPin,
  FileText,
  RefreshCw,
  Clock,
} from "lucide-react";
import { DataTable } from "@/components/admin/data-table";

// ── Types ─────────────────────────────────────────────────────────────────────

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Refunded";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  qty: number;
  unitPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  notes: string;
  createdAt: string;
}

interface BackendOrderItem {
  id: string;
  product_id: string;
  product_name: string;
  qty: number;
  unit_price: number;
}

interface BackendAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface BackendOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: OrderStatus;
  total: number;
  items: BackendOrderItem[];
  shipping_address: string | BackendAddress;
  notes: string;
  created_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatAddress(addr: string | BackendAddress | null | undefined): string {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  return [addr.line1, addr.line2, addr.city, addr.state, addr.zip, addr.country]
    .filter(Boolean)
    .join(", ");
}

function parseAddress(addr: string | BackendAddress | null | undefined): {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
} {
  const empty = { line1: "", line2: "", city: "", state: "", zip: "", country: "" };
  if (!addr) return empty;
  if (typeof addr === "string") return { ...empty, line1: addr };
  return {
    line1:   addr.line1   ?? "",
    line2:   addr.line2   ?? "",
    city:    addr.city    ?? "",
    state:   addr.state   ?? "",
    zip:     addr.zip     ?? "",
    country: addr.country ?? "",
  };
}

function toFrontend(b: BackendOrder): Order {
  return {
    id:              b.id,
    orderNumber:     b.order_number,
    customerName:    b.customer_name,
    customerEmail:   b.customer_email,
    status:          b.status,
    total:           Number(b.total),
    items: (b.items ?? []).map((it) => ({
      id:          it.id,
      productId:   it.product_id,
      productName: it.product_name,
      qty:         it.qty,
      unitPrice:   Number(it.unit_price),
    })),
    shippingAddress: formatAddress(b.shipping_address),
    notes:           b.notes ?? "",
    createdAt:       b.created_at,
  };
}

// ── Status Config ─────────────────────────────────────────────────────────────

const STATUS_LIST: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Refunded",
];

const STATUS_STYLES: Record <
  OrderStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  Pending:    { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-100",   dot: "#f59e0b" },
  Processing: { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-100",    dot: "#3b82f6" },
  Shipped:    { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-100",  dot: "#8b5cf6" },
  Delivered:  { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", dot: "#10b981" },
  Cancelled:  { bg: "bg-red-50",     text: "text-red-600",     border: "border-red-100",     dot: "#ef4444" },
  Refunded:   { bg: "bg-gray-100",   text: "text-gray-500",    border: "border-gray-200",    dot: "#9ca3af" },
};

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  Pending:    <Clock     className="w-3 h-3" />,
  Processing: <RefreshCw className="w-3 h-3" />,
  Shipped:    <Truck     className="w-3 h-3" />,
  Delivered:  <Check     className="w-3 h-3" />,
  Cancelled:  <X         className="w-3 h-3" />,
  Refunded:   <RefreshCw className="w-3 h-3" />,
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.dot }} />
      {status}
    </span>
  );
}

function CustomerAvatar({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const colors = [
    "bg-pink-100 text-pink-600",
    "bg-violet-100 text-violet-600",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-blue-100 text-blue-700",
    "bg-rose-100 text-rose-600",
  ];
  const colorClass = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-9 h-9 rounded-full ${colorClass} flex items-center justify-center text-xs font-semibold shrink-0`}>
      {initials}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.2em] text-pink-400 font-semibold mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

const iCls = (e?: string) =>
  `w-full text-sm border ${e ? "border-red-300" : "border-pink-200"} rounded-xl px-3.5 py-2.5 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 placeholder:text-gray-300 bg-white transition-all`;

// ── Status Select ─────────────────────────────────────────────────────────────

function StatusSelect({ value, onChange }: { value: OrderStatus; onChange: (v: OrderStatus) => void }) {
  const [open, setOpen] = useState(false);
  const current = STATUS_STYLES[value];
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full flex items-center justify-between gap-2 border border-pink-200 rounded-xl px-3.5 py-2.5 bg-white text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
      >
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: current.dot }} />
          <span className="text-gray-700">{value}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-300 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-pink-100 rounded-xl shadow-xl shadow-pink-100/50 overflow-hidden">
          {STATUS_LIST.map((s) => {
            const st = STATUS_STYLES[s];
            return (
              <button
                key={s}
                type="button"
                onMouseDown={() => { onChange(s); setOpen(false); }}
                className={`w-full text-left text-sm px-4 py-2.5 flex items-center gap-2.5 hover:bg-pink-50 transition-colors ${value === s ? "text-pink-600 font-medium" : "text-gray-600"}`}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: st.dot }} />
                {s}
                {value === s && <Check className="w-3 h-3 ml-auto text-pink-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Order Modal (Create / Edit) ───────────────────────────────────────────────

const EMPTY_FORM = {
  customerName:  "",
  customerEmail: "",
  status:        "Pending" as OrderStatus,
  // shipping address fields
  line1:   "",
  line2:   "",
  city:    "",
  state:   "",
  zip:     "",
  country: "",
  notes: "",
};

function OrderModal({
  mode,
  order,
  onSave,
  onClose,
}: {
  mode: "create" | "edit";
  order?: Order;
  onSave: (o: Order) => void;
  onClose: () => void;
}) {
  const parsedAddr = parseAddress(order?.shippingAddress);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
    ...(order
      ? {
          customerName:  order.customerName,
          customerEmail: order.customerEmail,
          status:        order.status,
          notes:         order.notes,
          line1:         parsedAddr.line1,
          line2:         parsedAddr.line2,
          city:          parsedAddr.city,
          state:         parsedAddr.state,
          zip:           parsedAddr.zip,
          country:       parsedAddr.country,
        }
      : {}),
  });

  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [saving, setSaving]   = useState(false);

  const set = (k: string, v: unknown) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim())  e.customerName  = "Required";
    if (!form.customerEmail.trim()) e.customerEmail = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.customerEmail)) e.customerEmail = "Invalid email";
    if (!form.line1.trim()) e.line1 = "Required";
    if (!form.city.trim())  e.city  = "Required";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const payload = {
        customer_name:  form.customerName.trim(),
        customer_email: form.customerEmail.trim(),
        status:         form.status,
        shipping_address: {
          line1:   form.line1.trim(),
          line2:   form.line2.trim(),
          city:    form.city.trim(),
          state:   form.state.trim(),
          zip:     form.zip.trim(),
          country: form.country.trim(),
        },
        notes: form.notes.trim(),
      };

      const url    = mode === "create" ? "/api/orders" : `/api/orders/${order!.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        if (json.errors) {
          const mapped: Record<string, string> = {};
          Object.entries(json.errors as Record<string, string[]>).forEach(([k, v]) => {
            mapped[k] = v[0];
          });
          setErrors(mapped);
        } else {
          throw new Error(json.message ?? "Request failed");
        }
        return;
      }

      onSave(toFrontend(json.data));
    } catch (err) {
      console.error(err);
      setErrors({ _global: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl shadow-pink-200/40 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-pink-100">

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-pink-100 font-semibold mb-0.5">
              {mode === "create" ? "New Order" : "Edit Order"}
            </p>
            <h2 className="font-serif text-xl text-white">
              {mode === "create" ? "Create Order" : order?.orderNumber ?? "Order"}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-6 space-y-4">
          {errors._global && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errors._global}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Customer Name" error={errors.customerName}>
              <input
                value={form.customerName}
                onChange={(e) => set("customerName", e.target.value)}
                placeholder="e.g. Jane Smith"
                className={iCls(errors.customerName)}
              />
            </Field>
            <Field label="Customer Email" error={errors.customerEmail}>
              <input
                type="email"
                value={form.customerEmail}
                onChange={(e) => set("customerEmail", e.target.value)}
                placeholder="jane@example.com"
                className={iCls(errors.customerEmail)}
              />
            </Field>
          </div>

          <Field label="Status">
            <StatusSelect value={form.status} onChange={(v) => set("status", v)} />
          </Field>

          {/* Shipping Address */}
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-pink-400 font-semibold">
              Shipping Address
            </p>
            <Field label="Address Line 1" error={errors.line1}>
              <input
                value={form.line1}
                onChange={(e) => set("line1", e.target.value)}
                placeholder="123 Main St"
                className={iCls(errors.line1)}
              />
            </Field>
            <Field label="Address Line 2">
              <input
                value={form.line2}
                onChange={(e) => set("line2", e.target.value)}
                placeholder="Apt, Suite, Unit (optional)"
                className={iCls()}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" error={errors.city}>
                <input
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="City"
                  className={iCls(errors.city)}
                />
              </Field>
              <Field label="State / Province">
                <input
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                  placeholder="State"
                  className={iCls()}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="ZIP / Postal Code">
                <input
                  value={form.zip}
                  onChange={(e) => set("zip", e.target.value)}
                  placeholder="ZIP"
                  className={iCls()}
                />
              </Field>
              <Field label="Country">
                <input
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                  placeholder="Country"
                  className={iCls()}
                />
              </Field>
            </div>
          </div>

          <Field label="Notes">
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Internal notes (optional)…"
              rows={2}
              className={iCls() + " resize-none"}
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-pink-100 bg-pink-50/30 shrink-0">
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-4 py-2">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-medium rounded-xl shadow-md shadow-pink-200 hover:shadow-pink-300 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            {saving ? "Saving…" : mode === "create" ? "Create Order" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────

function DeleteModal({
  order,
  onConfirm,
  onClose,
}: {
  order: Order;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const confirm = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-red-100 rounded-3xl shadow-2xl shadow-red-100/40 w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Delete Order?</h3>
            <p className="text-xs text-gray-400">This cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Permanently delete order{" "}
          <span className="font-semibold text-gray-700">{order.orderNumber}</span>{" "}
          for{" "}
          <span className="font-semibold text-gray-700">{order.customerName}</span>?
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={deleting}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── View Modal ────────────────────────────────────────────────────────────────

function ViewModal({
  order,
  onClose,
  onEdit,
}: {
  order: Order;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl shadow-pink-200/40 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-pink-100">

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-pink-100 font-semibold mb-0.5">
              Order Detail
            </p>
            <h2 className="font-serif text-xl text-white">{order.orderNumber}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* Customer */}
          <div className="flex items-center gap-3 p-4 bg-pink-50/60 rounded-2xl border border-pink-100">
            <CustomerAvatar name={order.customerName} />
            <div>
              <p className="text-sm font-semibold text-gray-800">{order.customerName}</p>
              <p className="text-xs text-gray-400">{order.customerEmail}</p>
            </div>
            <div className="ml-auto">
              <StatusBadge status={order.status} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-pink-50/60 rounded-2xl p-4 border border-pink-100">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold">Order Total</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">${order.total.toFixed(2)}</p>
            </div>
            <div className="bg-pink-50/60 rounded-2xl p-4 border border-pink-100">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold">Items</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{order.items.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {order.items.reduce((s, i) => s + i.qty, 0)} units total
              </p>
            </div>
          </div>

          {/* Order items */}
          {order.items.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold">
                Order Items
              </span>
              <div className="border border-pink-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-pink-50/60">
                    <tr>
                      <th className="text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-pink-400 font-semibold">Product</th>
                      <th className="text-center px-4 py-2.5 text-[10px] uppercase tracking-widest text-pink-400 font-semibold">Qty</th>
                      <th className="text-right px-4 py-2.5 text-[10px] uppercase tracking-widest text-pink-400 font-semibold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={item.id} className={idx < order.items.length - 1 ? "border-b border-pink-100" : ""}>
                        <td className="px-4 py-3 text-gray-700">{item.productName}</td>
                        <td className="px-4 py-3 text-center text-gray-500">{item.qty}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-800">
                          ${(item.qty * item.unitPrice).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-pink-50/60 border-t border-pink-100">
                    <tr>
                      <td colSpan={2} className="px-4 py-2.5 text-xs text-gray-400 font-medium">Total</td>
                      <td className="px-4 py-2.5 text-right font-bold text-gray-800">${order.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Shipping */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold">Shipping Address</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{order.shippingAddress || "—"}</p>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold">Notes</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed italic">{order.notes}</p>
            </div>
          )}

          <p className="text-[11px] text-gray-300">Placed on {order.createdAt}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-pink-100 bg-pink-50/30 shrink-0">
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-4 py-2">
            Close
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-medium rounded-xl shadow-md shadow-pink-200 hover:shadow-pink-300 active:scale-[0.98] transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            Edit Order
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders, setOrders]       = useState<Order[]>([]);
  const [loading, setLoading]     = useState(true);
  const [fetchErr, setFetchErr]   = useState("");
  const [modal, setModal]         = useState<{
    type: "create" | "edit" | "delete" | "view";
    order?: Order;
  } | null>(null);
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState<OrderStatus | "">("");

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("/api/orders");
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? "Failed to load");
        setOrders((json.data as BackendOrder[]).map(toFrontend));
      } catch (err) {
        setFetchErr(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = orders.filter((o) => {
    const s = search.toLowerCase();
    return (
      (!s ||
        o.orderNumber.toLowerCase().includes(s) ||
        o.customerName.toLowerCase().includes(s) ||
        o.customerEmail.toLowerCase().includes(s)) &&
      (!statusFilter || o.status === statusFilter)
    );
  });

  const handleSave = (saved: Order) => {
    if (modal?.type === "create") {
      setOrders((prev) => [saved, ...prev]);
    } else if (modal?.order) {
      setOrders((prev) => prev.map((x) => (x.id === modal.order!.id ? saved : x)));
    }
    setModal(null);
  };

  const handleDelete = async () => {
    if (!modal?.order) return;
    const id = modal.order.id;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? "Delete failed");
      }
      setOrders((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Delete failed");
    }
    setModal(null);
  };

  const revenue = orders
    .filter((o) => !["Cancelled", "Refunded"].includes(o.status))
    .reduce((s, o) => s + o.total, 0);

  const stats = {
    total:     orders.length,
    revenue,
    pending:   orders.filter((o) => o.status === "Pending").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
  };

  const statCards = [
    {
      icon: Layers, label: "Total Orders", value: stats.total,
      display: String(stats.total), max: Math.max(stats.total, 1),
      sub: "all orders", from: "from-pink-500", to: "to-rose-400",
      light: "bg-pink-50", text: "text-pink-500",
    },
    {
      icon: DollarSign, label: "Revenue", value: stats.revenue,
      display: `$${stats.revenue.toFixed(2)}`, max: Math.max(stats.revenue, 1),
      sub: "excl. cancelled & refunded", from: "from-emerald-400", to: "to-teal-400",
      light: "bg-emerald-50", text: "text-emerald-500",
    },
    {
      icon: TrendingUp, label: "Pending", value: stats.pending,
      display: String(stats.pending), max: Math.max(stats.total, 1),
      sub: "awaiting action", from: "from-amber-400", to: "to-orange-400",
      light: "bg-amber-50", text: "text-amber-500",
    },
    {
      icon: Archive, label: "Delivered", value: stats.delivered,
      display: String(stats.delivered), max: Math.max(stats.total, 1),
      sub: "completed orders", from: "from-violet-400", to: "to-purple-500",
      light: "bg-violet-50", text: "text-violet-500",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-pink-50/60 via-white to-rose-50/40 space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-pink-100/60 p-5 shadow-sm shadow-pink-50 hover:shadow-md hover:shadow-pink-100/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                <div className={`w-8 h-8 rounded-xl ${s.light} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.text}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">{s.display}</p>
              <p className="text-[11px] text-gray-400">{s.sub}</p>
              <div className="mt-3 h-1 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${s.from} ${s.to} transition-all duration-700`}
                  style={{ width: `${Math.min((s.value / s.max) * 100, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Search + filter + New Order */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders, customers…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-200 rounded-full text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 placeholder:text-gray-300 shadow-sm transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["", ...STATUS_LIST] as (OrderStatus | "")[]).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                statusFilter === st
                  ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200"
                  : "bg-white border border-pink-200 text-gray-500 hover:border-pink-300 hover:text-pink-600"
              }`}
            >
              {st && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_STYLES[st].dot }} />}
              {st || "All"}
            </button>
          ))}
        </div>
        <button
          onClick={() => setModal({ type: "create" })}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-medium rounded-full shadow-md shadow-pink-200 hover:shadow-pink-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          New Order
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-pink-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading orders…</span>
        </div>
      ) : fetchErr ? (
        <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {fetchErr}
        </div>
      ) : (
        <DataTable
          idField="id"
          data={filtered}
          accentColor={() => "#f9a8c9"}
          onView={(id) => {
            const o = orders.find((x) => x.id === id);
            if (o) setModal({ type: "view", order: o });
          }}
          onEdit={(id) => {
            const o = orders.find((x) => x.id === id);
            if (o) setModal({ type: "edit", order: o });
          }}
          onDelete={(id) => {
            const o = orders.find((x) => x.id === id);
            if (o) setModal({ type: "delete", order: o });
          }}
          columns={[
            {
              key: "orderNumber",
              label: "Order",
              width: "auto",
              render: (v: string) => (
                <span className="text-xs font-mono font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">{v}</span>
              ),
            },
            {
              key: "customerName",
              label: "Customer",
              width: "1fr",
              render: (_, o: Order) => (
                <div className="flex items-center gap-3 min-w-0">
                  <CustomerAvatar name={o.customerName} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{o.customerName}</p>
                    <p className="text-xs text-gray-400 truncate">{o.customerEmail}</p>
                  </div>
                </div>
              ),
            },
            {
              key: "status",
              label: "Status",
              width: "auto",
              render: (v: OrderStatus) => <StatusBadge status={v} />,
            },
            {
              key: "total",
              label: "Total",
              width: "auto",
              render: (v: number) => (
                <span className="text-sm font-bold text-gray-800 whitespace-nowrap">${v.toFixed(2)}</span>
              ),
            },
            {
              key: "items",
              label: "Items",
              width: "auto",
              render: (v: OrderItem[]) => (
                <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  {v.length} item{v.length !== 1 ? "s" : ""}
                </span>
              ),
            },
            {
              key: "createdAt",
              label: "Date",
              width: "auto",
              render: (v: string) => (
                <span className="text-xs text-gray-400 whitespace-nowrap">{v}</span>
              ),
            },
          ]}
        />
      )}

      {/* Modals */}
      {modal?.type === "view" && modal.order && (
        <ViewModal
          order={modal.order}
          onClose={() => setModal(null)}
          onEdit={() => setModal({ type: "edit", order: modal.order })}
        />
      )}
      {(modal?.type === "create" || modal?.type === "edit") && (
        <OrderModal
          mode={modal.type}
          order={modal.order}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "delete" && modal.order && (
        <DeleteModal
          order={modal.order}
          onConfirm={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}