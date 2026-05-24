"use client";

import { useState, useEffect } from "react";
import {
  Search,
  AlertCircle,
  X,
  Mail,
  MessageSquare,
  Users,
  Inbox,
  Loader2,
  Eye,
  Trash2,
} from "lucide-react";
import { DataTable } from "@/components/admin/data-table";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface BackendContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toFrontend(b: BackendContact): ContactSubmission {
  return {
    id:        b.id,
    name:      b.name,
    email:     b.email,
    subject:   b.subject,
    message:   b.message,
    createdAt: b.created_at,
  };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ContactAvatar({ name }: { name: string }) {
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

// ── View Modal ────────────────────────────────────────────────────────────────

function ViewModal({
  contact,
  onClose,
  onDelete,
}: {
  contact: ContactSubmission;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl shadow-pink-200/40 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-pink-100">

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-pink-100 font-semibold mb-0.5">
              Submission Detail
            </p>
            <h2 className="font-serif text-xl text-white truncate max-w-xs">
              {contact.subject}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* Sender */}
          <div className="flex items-center gap-3 p-4 bg-pink-50/60 rounded-2xl border border-pink-100">
            <ContactAvatar name={contact.name} />
            <div>
              <p className="text-sm font-semibold text-gray-800">{contact.name}</p>
              
            <a    href={`mailto:${contact.email}`}
                className="text-xs text-pink-500 hover:underline"
              >
                {contact.email}
              </a>
            </div>
            <p className="ml-auto text-[11px] text-gray-400 whitespace-nowrap">
              {contact.createdAt}
            </p>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold">
                Subject
              </span>
            </div>
            <p className="text-sm font-medium text-gray-700">{contact.subject}</p>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold">
                Message
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap bg-pink-50/60 rounded-xl p-4 border border-pink-100">
              {contact.message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-pink-100 bg-pink-50/30 shrink-0">
          <button
            onClick={onDelete}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-600 transition-colors px-4 py-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
          
           <a href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject)}`}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-medium rounded-xl shadow-md shadow-pink-200 hover:shadow-pink-300 active:scale-[0.98] transition-all"
          >
            <Mail className="w-3.5 h-3.5" />
            Reply via Email
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────

function DeleteModal({
  contact,
  onConfirm,
  onClose,
}: {
  contact: ContactSubmission;
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
            <h3 className="font-semibold text-gray-800">Delete Submission?</h3>
            <p className="text-xs text-gray-400">This cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Permanently delete the message from{" "}
          <span className="font-semibold text-gray-700">{contact.name}</span>{" "}
          regarding{" "}
          <span className="font-semibold text-gray-700">"{contact.subject}"</span>?
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
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminContactsPage() {
  const [contacts, setContacts]   = useState<ContactSubmission[]>([]);
  const [loading, setLoading]     = useState(true);
  const [fetchErr, setFetchErr]   = useState("");
  const [search, setSearch]       = useState("");
  const [modal, setModal]         = useState<{
    type: "view" | "delete";
    contact: ContactSubmission;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("/api/contacts");
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? "Failed to load");
        setContacts((json.data as BackendContact[]).map(toFrontend));
      } catch (err) {
        setFetchErr(err instanceof Error ? err.message : "Failed to load contacts");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = contacts.filter((c) => {
    const s = search.toLowerCase();
    return (
      !s ||
      c.name.toLowerCase().includes(s) ||
      c.email.toLowerCase().includes(s) ||
      c.subject.toLowerCase().includes(s)
    );
  });

  const handleDelete = async () => {
    if (!modal?.contact) return;
    const id = modal.contact.id;
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const json = await res.json();
        throw new Error(json.message ?? "Delete failed");
      }
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Delete failed");
    }
    setModal(null);
  };

  // Stats
  const today = new Date().toDateString();
  const todayCount = contacts.filter(
    (c) => new Date(c.createdAt).toDateString() === today
  ).length;

  const uniqueSenders = new Set(contacts.map((c) => c.email)).size;

  const statCards = [
    {
      icon: Inbox,
      label: "Total Submissions",
      value: contacts.length,
      display: String(contacts.length),
      sub: "all time",
      from: "from-pink-500", to: "to-rose-400",
      light: "bg-pink-50", text: "text-pink-500",
    },
    {
      icon: MessageSquare,
      label: "Today",
      value: todayCount,
      display: String(todayCount),
      sub: "received today",
      from: "from-violet-400", to: "to-purple-500",
      light: "bg-violet-50", text: "text-violet-500",
    },
    {
      icon: Users,
      label: "Unique Senders",
      value: uniqueSenders,
      display: String(uniqueSenders),
      sub: "distinct emails",
      from: "from-emerald-400", to: "to-teal-400",
      light: "bg-emerald-50", text: "text-emerald-500",
    },
    {
      icon: Mail,
      label: "Filtered Results",
      value: filtered.length,
      display: String(filtered.length),
      sub: "matching search",
      from: "from-amber-400", to: "to-orange-400",
      light: "bg-amber-50", text: "text-amber-500",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-pink-50/60 via-white to-rose-50/40 space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-pink-100/60 p-5 shadow-sm shadow-pink-50 hover:shadow-md hover:shadow-pink-100/50 transition-all"
            >
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
                  style={{
                    width: `${Math.min(
                      (s.value / Math.max(contacts.length, 1)) * 100,
                      100
                    )}%`,
                  }}
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
            placeholder="Search by name, email, or subject…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-200 rounded-full text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 placeholder:text-gray-300 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-pink-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading submissions…</span>
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
            const c = contacts.find((x) => x.id === id);
            if (c) setModal({ type: "view", contact: c });
          }}
          onDelete={(id) => {
            const c = contacts.find((x) => x.id === id);
            if (c) setModal({ type: "delete", contact: c });
          }}
          columns={[
            {
              key: "name",
              label: "Sender",
              width: "1fr",
              render: (_: string, c: ContactSubmission) => (
                <div className="flex items-center gap-3 min-w-0">
                  <ContactAvatar name={c.name} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                    <p className="text-xs text-gray-400 truncate">{c.email}</p>
                  </div>
                </div>
              ),
            },
            {
              key: "subject",
              label: "Subject",
              width: "1.5fr",
              render: (v: string) => (
                <span className="text-sm text-gray-700 truncate block max-w-xs">{v}</span>
              ),
            },
            {
              key: "message",
              label: "Preview",
              width: "2fr",
              render: (v: string) => (
                <span className="text-xs text-gray-400 truncate block max-w-sm">
                  {v.length > 80 ? v.slice(0, 80) + "…" : v}
                </span>
              ),
            },
            {
              key: "createdAt",
              label: "Received",
              width: "auto",
              render: (v: string) => (
                <span className="text-xs text-gray-400 whitespace-nowrap">{v}</span>
              ),
            },
          ]}
        />
      )}

      {/* Modals */}
      {modal?.type === "view" && (
        <ViewModal
          contact={modal.contact}
          onClose={() => setModal(null)}
          onDelete={() => setModal({ type: "delete", contact: modal.contact })}
        />
      )}
      {modal?.type === "delete" && (
        <DeleteModal
          contact={modal.contact}
          onConfirm={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}