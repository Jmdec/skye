"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  X,
  Search,
  AlertCircle,
  Check,
  Loader2,
  Eye,
  Star,
  Megaphone,
  FileText,
  Layers,
  Tag as TagIcon,
} from "lucide-react";
import { DataTable } from "@/components/admin/data-table";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Announcement {
  id: string;
  title: string;
  tag: string;
  content: string;
  featured: boolean;
  publishedAt: string;
}

interface BackendAnnouncement {
  id: string;
  title: string;
  tag: string;
  content: string;
  featured: boolean;
  published_at: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TAG_LIST = ["New Arrival", "Offer", "Event", "Update", "Blog"];

const TAG_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  "New Arrival": { bg: "bg-pink-50",   text: "text-pink-600",   dot: "#ec4899" },
  Offer:         { bg: "bg-amber-50",  text: "text-amber-700",  dot: "#f59e0b" },
  Event:         { bg: "bg-violet-50", text: "text-violet-700", dot: "#8b5cf6" },
  Update:        { bg: "bg-emerald-50",text: "text-emerald-700",dot: "#10b981" },
  Blog:          { bg: "bg-blue-50",   text: "text-blue-700",   dot: "#3b82f6" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function toFrontend(b: BackendAnnouncement): Announcement {
  return {
    id:          b.id,
    title:       b.title,
    tag:         b.tag,
    content:     b.content,
    featured:    b.featured,
    publishedAt: b.published_at,
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-AU", {
    year: "numeric", month: "short", day: "numeric",
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TagBadge({ tag }: { tag: string }) {
  const s = TAG_STYLES[tag] ?? TAG_STYLES["New Arrival"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.dot }} />
      {tag}
    </span>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.2em] text-pink-400 font-semibold mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

const iCls = (e?: string) =>
  `w-full text-sm border ${e ? "border-red-300" : "border-pink-200"} rounded-xl px-3.5 py-2.5 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 placeholder:text-gray-300 bg-white transition-all`;

// ── Tag Select ────────────────────────────────────────────────────────────────

function TagSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = TAG_STYLES[value] ?? TAG_STYLES["New Arrival"];

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
        <TagIcon className="w-3.5 h-3.5 text-gray-300" />
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-pink-100 rounded-xl shadow-xl shadow-pink-100/50 overflow-hidden">
          {TAG_LIST.map((t) => {
            const st = TAG_STYLES[t];
            return (
              <button
                key={t}
                type="button"
                onMouseDown={() => { onChange(t); setOpen(false); }}
                className={`w-full text-left text-sm px-4 py-2.5 flex items-center gap-2.5 hover:bg-pink-50 transition-colors ${value === t ? "text-pink-600 font-medium" : "text-gray-600"}`}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: st.dot }} />
                {t}
                {value === t && <Check className="w-3 h-3 ml-auto text-pink-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Announcement Modal (Create / Edit) ────────────────────────────────────────

const EMPTY_FORM = {
  title:       "",
  tag:         "New Arrival",
  content:     "",
  featured:    false,
  publishedAt: new Date().toISOString().slice(0, 10),
};

function AnnouncementModal({
  mode,
  announcement,
  onSave,
  onClose,
}: {
  mode: "create" | "edit";
  announcement?: Announcement;
  onSave: (a: Announcement) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    ...(announcement
      ? {
          title:       announcement.title,
          tag:         announcement.tag,
          content:     announcement.content,
          featured:    announcement.featured,
          publishedAt: announcement.publishedAt?.slice(0, 10) ?? EMPTY_FORM.publishedAt,
        }
      : {}),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: unknown) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim())   e.title   = "Required";
    if (!form.content.trim()) e.content = "Required";
    if (!form.tag)            e.tag     = "Required";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const payload = {
        title:        form.title.trim(),
        tag:          form.tag,
        content:      form.content.trim(),
        featured:     form.featured,
        published_at: form.publishedAt,
      };

      const url    = mode === "create" ? "/api/announcements" : `/api/announcements/${announcement!.id}`;
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
              {mode === "create" ? "New Announcement" : "Edit Announcement"}
            </p>
            <h2 className="font-serif text-xl text-white">
              {mode === "create" ? "Create Announcement" : announcement?.title ?? "Announcement"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
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

          <Field label="Title" error={errors.title}>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Summer Collection Launch"
              className={iCls(errors.title)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Tag" error={errors.tag}>
              <TagSelect value={form.tag} onChange={(v) => set("tag", v)} />
            </Field>
            <Field label="Publish Date">
              <input
                type="date"
                value={form.publishedAt}
                onChange={(e) => set("publishedAt", e.target.value)}
                className={iCls()}
              />
            </Field>
          </div>

          <Field label="Content" error={errors.content}>
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Write your announcement content here…"
              rows={6}
              className={iCls(errors.content) + " resize-none"}
            />
          </Field>

          {/* Featured toggle */}
          <div className="flex items-center justify-between p-4 bg-pink-50/60 rounded-xl border border-pink-100">
            <div>
              <p className="text-sm font-medium text-gray-700">Featured</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Show this announcement in the featured section
              </p>
            </div>
            <button
              type="button"
              onClick={() => set("featured", !form.featured)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.featured ? "bg-pink-500" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${form.featured ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-pink-100 bg-pink-50/30 shrink-0">
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-medium rounded-xl shadow-md shadow-pink-200 hover:shadow-pink-300 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            {saving ? "Saving…" : mode === "create" ? "Create" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────

function DeleteModal({
  announcement,
  onConfirm,
  onClose,
}: {
  announcement: Announcement;
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
            <h3 className="font-semibold text-gray-800">Delete Announcement?</h3>
            <p className="text-xs text-gray-400">This cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Permanently delete{" "}
          <span className="font-semibold text-gray-700">"{announcement.title}"</span>?
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

// ── View Modal ────────────────────────────────────────────────────────────────

function ViewModal({
  announcement,
  onClose,
  onEdit,
}: {
  announcement: Announcement;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl shadow-pink-200/40 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-pink-100">

        <div className="bg-gradient-to-r from-pink-500 to-rose-400 px-6 py-5 flex items-center justify-between shrink-0">
          <div className="min-w-0 flex-1 pr-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-pink-100 font-semibold mb-0.5">
              Announcement Detail
            </p>
            <h2 className="font-serif text-xl text-white truncate">{announcement.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            <TagBadge tag={announcement.tag} />
            {announcement.featured && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
                <Star className="w-3 h-3" />
                Featured
              </span>
            )}
            <span className="text-xs text-gray-400 ml-auto">
              {formatDate(announcement.publishedAt)}
            </span>
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold">
                Content
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap bg-pink-50/60 rounded-xl p-4 border border-pink-100">
              {announcement.content}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-pink-100 bg-pink-50/30 shrink-0">
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-4 py-2"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-medium rounded-xl shadow-md shadow-pink-200 hover:shadow-pink-300 active:scale-[0.98] transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading]             = useState(true);
  const [fetchErr, setFetchErr]           = useState("");
  const [search, setSearch]               = useState("");
  const [tagFilter, setTagFilter]         = useState("");
  const [modal, setModal]                 = useState<{
    type: "create" | "edit" | "delete" | "view";
    announcement?: Announcement;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("/api/announcements");
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? "Failed to load");
        setAnnouncements((json.data as BackendAnnouncement[]).map(toFrontend));
      } catch (err) {
        setFetchErr(err instanceof Error ? err.message : "Failed to load announcements");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = announcements.filter((a) => {
    const s = search.toLowerCase();
    return (
      (!s || a.title.toLowerCase().includes(s) || a.content.toLowerCase().includes(s)) &&
      (!tagFilter || a.tag === tagFilter)
    );
  });

  const handleSave = (saved: Announcement) => {
    if (modal?.type === "create") {
      setAnnouncements((prev) => [saved, ...prev]);
    } else if (modal?.announcement) {
      setAnnouncements((prev) =>
        prev.map((x) => (x.id === modal.announcement!.id ? saved : x))
      );
    }
    setModal(null);
  };

  const handleDelete = async () => {
    if (!modal?.announcement) return;
    const id = modal.announcement.id;
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const json = await res.json();
        throw new Error(json.message ?? "Delete failed");
      }
      setAnnouncements((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
    setModal(null);
  };

  // Stats
  const featuredCount = announcements.filter((a) => a.featured).length;
  const tagCounts = TAG_LIST.reduce(
    (acc, t) => ({ ...acc, [t]: announcements.filter((a) => a.tag === t).length }),
    {} as Record<string, number>
  );
  const topTag = TAG_LIST.reduce((a, b) => (tagCounts[a] >= tagCounts[b] ? a : b), TAG_LIST[0]);

  const statCards = [
    {
      icon: Megaphone, label: "Total", value: announcements.length,
      display: String(announcements.length), sub: "all announcements",
      from: "from-pink-500", to: "to-rose-400",
      light: "bg-pink-50", text: "text-pink-500",
    },
    {
      icon: Star, label: "Featured", value: featuredCount,
      display: String(featuredCount), sub: "shown as featured",
      from: "from-amber-400", to: "to-orange-400",
      light: "bg-amber-50", text: "text-amber-500",
    },
    {
      icon: Layers, label: "Filtered", value: filtered.length,
      display: String(filtered.length), sub: "matching search",
      from: "from-violet-400", to: "to-purple-500",
      light: "bg-violet-50", text: "text-violet-500",
    },
    {
      icon: TagIcon, label: "Top Tag", value: tagCounts[topTag] ?? 0,
      display: topTag, sub: `${tagCounts[topTag] ?? 0} posts`,
      from: "from-emerald-400", to: "to-teal-400",
      light: "bg-emerald-50", text: "text-emerald-500",
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
              <p className="text-2xl font-bold text-gray-800 mb-1 truncate">{s.display}</p>
              <p className="text-[11px] text-gray-400">{s.sub}</p>
              <div className="mt-3 h-1 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${s.from} ${s.to} transition-all duration-700`}
                  style={{ width: `${Math.min((s.value / Math.max(announcements.length, 1)) * 100, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Search + tag filter + New */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search announcements…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-200 rounded-full text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 placeholder:text-gray-300 shadow-sm transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["", ...TAG_LIST] as string[]).map((t) => (
            <button
              key={t}
              onClick={() => setTagFilter(t)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                tagFilter === t
                  ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200"
                  : "bg-white border border-pink-200 text-gray-500 hover:border-pink-300 hover:text-pink-600"
              }`}
            >
              {t && (
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: TAG_STYLES[t]?.dot }}
                />
              )}
              {t || "All"}
            </button>
          ))}
        </div>
        <button
          onClick={() => setModal({ type: "create" })}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-medium rounded-full shadow-md shadow-pink-200 hover:shadow-pink-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          New Announcement
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-pink-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading announcements…</span>
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
            const a = announcements.find((x) => x.id === id);
            if (a) setModal({ type: "view", announcement: a });
          }}
          onEdit={(id) => {
            const a = announcements.find((x) => x.id === id);
            if (a) setModal({ type: "edit", announcement: a });
          }}
          onDelete={(id) => {
            const a = announcements.find((x) => x.id === id);
            if (a) setModal({ type: "delete", announcement: a });
          }}
          columns={[
            {
              key: "title",
              label: "Title",
              width: "2fr",
              render: (v: string, a: Announcement) => (
                <div className="flex items-center gap-2 min-w-0">
                  {a.featured && <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  <span className="text-sm font-semibold text-gray-800 truncate">{v}</span>
                </div>
              ),
            },
            {
              key: "tag",
              label: "Tag",
              width: "auto",
              render: (v: string) => <TagBadge tag={v} />,
            },
            {
              key: "content",
              label: "Preview",
              width: "2fr",
              render: (v: string) => (
                <span className="text-xs text-gray-400 truncate block max-w-xs">
                  {v.length > 80 ? v.slice(0, 80) + "…" : v}
                </span>
              ),
            },
            {
              key: "publishedAt",
              label: "Published",
              width: "auto",
              render: (v: string) => (
                <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(v)}</span>
              ),
            },
          ]}
        />
      )}

      {/* Modals */}
      {modal?.type === "view" && modal.announcement && (
        <ViewModal
          announcement={modal.announcement}
          onClose={() => setModal(null)}
          onEdit={() => setModal({ type: "edit", announcement: modal.announcement })}
        />
      )}
      {(modal?.type === "create" || modal?.type === "edit") && (
        <AnnouncementModal
          mode={modal.type}
          announcement={modal.announcement}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "delete" && modal.announcement && (
        <DeleteModal
          announcement={modal.announcement}
          onConfirm={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}