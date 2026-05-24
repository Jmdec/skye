"use client";

import { useState, useEffect } from "react";
import {
  Search,
  AlertCircle,
  X,
  Mail,
  Users,
  Inbox,
  Loader2,
  Trash2,
  Calendar,
} from "lucide-react";
import { DataTable } from "@/components/admin/data-table";

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

interface BackendSubscriber {
  id: string;
  email: string;
  created_at: string;
}

function toFrontend(b: BackendSubscriber): Subscriber {
  return { id: b.id, email: b.email, createdAt: b.created_at };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-AU", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function getInitial(email: string) {
  return email[0].toUpperCase();
}

function EmailAvatar({ email }: { email: string }) {
  const colors = [
    "bg-pink-100 text-pink-600",
    "bg-violet-100 text-violet-600",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-blue-100 text-blue-700",
  ];
  const cls = colors[email.charCodeAt(0) % colors.length];
  return (
    <div className={`w-9 h-9 rounded-full ${cls} flex items-center justify-center text-xs font-semibold shrink-0`}>
      {getInitial(email)}
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────

function DeleteModal({
  subscriber,
  onConfirm,
  onClose,
}: {
  subscriber: Subscriber;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const confirm = async () => { setDeleting(true); await onConfirm(); setDeleting(false); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-red-100 rounded-3xl shadow-2xl shadow-red-100/40 w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Remove Subscriber?</h3>
            <p className="text-xs text-gray-400">This cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Unsubscribe{" "}
          <span className="font-semibold text-gray-700">{subscriber.email}</span>{" "}
          from the newsletter?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={deleting}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {deleting ? "Removing…" : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading]         = useState(true);
  const [fetchErr, setFetchErr]       = useState("");
  const [search, setSearch]           = useState("");
  const [modal, setModal]             = useState<{ subscriber: Subscriber } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("/api/newsletter");
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? "Failed to load");
        setSubscribers((json.data as BackendSubscriber[]).map(toFrontend));
      } catch (err) {
        setFetchErr(err instanceof Error ? err.message : "Failed to load subscribers");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = subscribers.filter((s) =>
    !search || s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!modal) return;
    const id = modal.subscriber.id;
    try {
      const res = await fetch(`/api/newsletter/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const json = await res.json();
        throw new Error(json.message ?? "Delete failed");
      }
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
    setModal(null);
  };

  // Stats
  const today     = new Date().toDateString();
  const todayCount = subscribers.filter(
    (s) => new Date(s.createdAt).toDateString() === today
  ).length;

  const thisMonth = subscribers.filter((s) => {
    const d = new Date(s.createdAt);
    const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }).length;

  const statCards = [
    {
      icon: Users,  label: "Total Subscribers", value: subscribers.length,
      display: String(subscribers.length), sub: "all time",
      from: "from-pink-500", to: "to-rose-400", light: "bg-pink-50",  text: "text-pink-500",
    },
    {
      icon: Inbox,  label: "This Month", value: thisMonth,
      display: String(thisMonth), sub: "subscribed this month",
      from: "from-violet-400", to: "to-purple-500", light: "bg-violet-50", text: "text-violet-500",
    },
    {
      icon: Mail,   label: "Today", value: todayCount,
      display: String(todayCount), sub: "subscribed today",
      from: "from-emerald-400", to: "to-teal-400", light: "bg-emerald-50", text: "text-emerald-500",
    },
    {
      icon: Search, label: "Filtered", value: filtered.length,
      display: String(filtered.length), sub: "matching search",
      from: "from-amber-400", to: "to-orange-400", light: "bg-amber-50",  text: "text-amber-500",
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
                  style={{ width: `${Math.min((s.value / Math.max(subscribers.length, 1)) * 100, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-200 rounded-full text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 placeholder:text-gray-300 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-pink-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading subscribers…</span>
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
          onDelete={(id) => {
            const s = subscribers.find((x) => x.id === id);
            if (s) setModal({ subscriber: s });
          }}
          columns={[
            {
              key: "email",
              label: "Subscriber",
              width: "2fr",
              render: (_: string, s: Subscriber) => (
                <div className="flex items-center gap-3 min-w-0">
                 <EmailAvatar email={s.email} />

<a
  href={`mailto:${s.email}`}
  className="text-sm font-medium text-pink-600 hover:underline truncate"
>
  {s.email}
</a>
                </div>
              ),
            },
            {
              key: "createdAt",
              label: "Subscribed",
              width: "auto",
              render: (v: string) => (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(v)}
                </div>
              ),
            },
          ]}
        />
      )}

      {/* Delete Modal */}
      {modal && (
        <DeleteModal
          subscriber={modal.subscriber}
          onConfirm={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}