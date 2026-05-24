"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Plus,
  X,
  Upload,
  Search,
  ImageIcon,
  AlertCircle,
  Check,
  Star,
  ChevronDown,
  Minus,
  Sparkles,
  TrendingUp,
  Archive,
  Layers,
  Loader2,
  Eye,
  Tag,
  DollarSign,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { useToast } from "@/hooks/use-toast";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  file?: File;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: ProductImage[];
  stock: number;
  featured: boolean;
  createdAt: string;
}

interface BackendImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface BackendProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  featured: boolean;
  createdAt: string;
  images: BackendImage[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toFrontend(b: BackendProduct): Product {
  return {
    id: b.id,
    name: b.name,
    category: b.category,
    price: Number(b.price),
    description: b.description,
    stock: b.stock,
    featured: Boolean(b.featured),
    createdAt: b.createdAt,
    images: (b.images ?? []).map((img) => ({
      id: img.id,
      url: img.url,
      isPrimary: Boolean(img.isPrimary),
    })),
  };
}

// ── Categories ────────────────────────────────────────────────────────────────

const CATEGORY_SUGGESTIONS = [
  "Skincare", "Fragrance", "Wellness", "Makeup", "Foundation",
  "Lip Color", "Eye Shadow", "Blush & Bronzer", "Mascara", "Concealer",
  "Primer", "Setting Spray", "Eyebrow", "Highlighter", "Contour",
  "Nail Care", "Hair Care", "Shampoo", "Conditioner", "Hair Mask",
  "Hair Oil", "Hair Serum", "Body Care", "Body Lotion", "Body Scrub",
  "Body Oil", "Hand Cream", "Foot Care", "Sun Care", "SPF / Sunscreen",
  "After Sun", "Self Tanner", "Cleanser", "Toner", "Serum",
  "Moisturizer", "Eye Cream", "Face Mask", "Face Oil", "Exfoliator",
  "Lip Care", "Lip Balm", "Lip Scrub", "Perfume", "Eau de Toilette",
  "Body Mist", "Candle", "Bath & Body", "Bath Salts", "Bubble Bath",
  "Shower Gel", "Intimate Care", "Tools & Brushes", "Facial Roller",
  "Gua Sha", "Makeup Remover", "Micellar Water", "Sheet Mask",
  "Pore Strips", "Vitamins & Supplements", "Collagen", "Probiotics",
  "Gift Sets",
];

const CAT_COLORS: Record<string, string> = {
  skincare: "#f9a8c9",
  fragrance: "#c4b5fd",
  wellness: "#86efac",
  makeup: "#fde68a",
  "hair care": "#93c5fd",
  "body care": "#fed7aa",
  "sun care": "#fcd34d",
  "nail care": "#f0abfc",
};
const catColor = (c: string) => CAT_COLORS[c.toLowerCase()] ?? "#e9d5ff";

// ── Sub-components ────────────────────────────────────────────────────────────

function CategoryCombobox({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(value);
  const filtered = q.trim()
    ? CATEGORY_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(q.toLowerCase()),
      )
    : CATEGORY_SUGGESTIONS;
  return (
    <div className="relative">
      <div className="relative">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="e.g. Skincare, Serum…"
          className={`w-full text-sm border ${error ? "border-red-300" : "border-pink-200"} rounded-xl px-3.5 py-2.5 pr-8 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 placeholder:text-gray-300 bg-white transition-all`}
        />
        <ChevronDown
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-pink-100 rounded-xl shadow-xl shadow-pink-100/50 max-h-48 overflow-y-auto">
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={() => {
                setQ(s);
                onChange(s);
                setOpen(false);
              }}
              className={`w-full text-left text-sm px-4 py-2.5 flex items-center gap-2.5 hover:bg-pink-50 transition-colors ${value === s ? "text-pink-600 font-medium" : "text-gray-600"}`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: catColor(s) }}
              />
              {s}
              {value === s && (
                <Check className="w-3 h-3 ml-auto text-pink-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ImageUploadZone({
  images,
  onAdd,
  onRemove,
  onSetPrimary,
}: {
  images: ProductImage[];
  onAdd: (i: ProductImage[]) => void;
  onRemove: (id: string) => void;
  onSetPrimary: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const process = useCallback(
    (files: FileList) => {
      const imgs: ProductImage[] = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .map((f, i) => ({
          id: "new_" + Math.random().toString(36).slice(2),
          url: URL.createObjectURL(f),
          isPrimary: images.length === 0 && i === 0,
          file: f,
        }));
      onAdd(imgs);
    },
    [images.length, onAdd],
  );
  return (
    <div className="space-y-3">
      <label className="block text-[11px] uppercase tracking-[0.2em] text-pink-400 font-semibold">
        Images
      </label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); process(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl cursor-pointer transition-all py-8 ${drag ? "border-pink-400 bg-pink-50" : "border-pink-200 hover:border-pink-300 hover:bg-pink-50/50"}`}
      >
        <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
          <Upload className="w-4 h-4 text-pink-400" />
        </div>
        <p className="text-sm text-gray-500">
          Drop images or{" "}
          <span className="text-pink-500 font-medium">click to upload</span>
        </p>
        <p className="text-xs text-gray-300">PNG, JPG, WEBP — multiple allowed</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && process(e.target.files)}
        />
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group aspect-square rounded-xl overflow-hidden border-2 border-pink-100"
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onSetPrimary(img.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${img.isPrimary ? "bg-yellow-400 text-black" : "bg-white/80 hover:bg-yellow-400 hover:text-black text-gray-600"}`}
                >
                  <Star className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(img.id)}
                  className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              {img.isPrimary && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-yellow-400 rounded-md">
                  <span className="text-[9px] font-bold text-black uppercase">Main</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StockStepper({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const n = parseInt(value) || 0;
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.2em] text-pink-400 font-semibold mb-1.5">
        Stock Count
      </label>
      <div className={`inline-flex items-center border-2 ${error ? "border-red-300" : "border-pink-200"} rounded-xl overflow-hidden bg-white`}>
        <button
          type="button"
          onClick={() => onChange(String(Math.max(0, n - 1)))}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-pink-500 hover:bg-pink-50 transition-all border-r border-pink-100"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 text-center text-sm bg-transparent outline-none py-2 font-semibold text-gray-700"
        />
        <button
          type="button"
          onClick={() => onChange(String(n + 1))}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-pink-500 hover:bg-pink-50 transition-all border-l border-pink-100"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-all duration-300 ${checked ? "bg-gradient-to-r from-pink-500 to-rose-400 shadow-md shadow-pink-200" : "bg-gray-200"}`}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300"
          style={{ left: checked ? "calc(100% - 18px)" : "2px" }}
        />
      </button>
      <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
        {label}
      </span>
    </label>
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
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

const iCls = (e?: string) =>
  `w-full text-sm border ${e ? "border-red-300" : "border-pink-200"} rounded-xl px-3.5 py-2.5 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 placeholder:text-gray-300 bg-white transition-all`;

// ── Product Modal ─────────────────────────────────────────────────────────────

const EMPTY = {
  name: "",
  category: "",
  price: "",
  description: "",
  stock: "0",
  featured: false,
};

function ProductModal({
  mode,
  product,
  onSave,
  onClose,
}: {
  mode: "create" | "edit";
  product?: Product;
  onSave: (d: Product, mode: "create" | "edit") => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...(product
      ? {
          name: product.name,
          category: product.category,
          price: String(product.price),
          description: product.description,
          stock: String(product.stock),
          featured: product.featured,
        }
      : {}),
  });
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: unknown) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => {
      const n = { ...e };
      delete n[k];
      return n;
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.category.trim()) e.category = "Required";
    if (!form.price || isNaN(Number(form.price))) e.price = "Valid price required";
    if (!form.description.trim()) e.description = "Required";
    if (form.stock === "" || isNaN(Number(form.stock))) e.stock = "Valid count required";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("category", form.category.trim());
      fd.append("price", form.price);
      fd.append("description", form.description.trim());
      fd.append("stock", String(Math.max(0, parseInt(form.stock) || 0)));
      fd.append("featured", form.featured ? "1" : "0");

      const savedImages = images.filter((img) => !img.id.startsWith("new_"));
      const newImages = images.filter((img) => img.id.startsWith("new_"));

      if (mode === "edit") {
        savedImages.forEach((img) => fd.append("kept_image_ids[]", img.id));
        const primarySaved = savedImages.find((img) => img.isPrimary);
        if (primarySaved) fd.append("primary_image_id", primarySaved.id);
      }

      let newPrimaryIndex = -1;
      newImages.forEach((img, idx) => {
        if (img.file) {
          fd.append("images[]", img.file);
          if (img.isPrimary) newPrimaryIndex = idx;
        }
      });
      if (newPrimaryIndex >= 0) fd.append("primary_index", String(newPrimaryIndex));

      const url = mode === "create" ? "/api/products" : `/api/products/${product!.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, { method, body: fd });
      const json = await res.json();

      if (!res.ok) {
        if (json.errors) {
          const mapped: Record<string, string> = {};
          Object.entries(json.errors as Record<string, string[]>).forEach(
            ([k, v]) => { mapped[k] = v[0]; },
          );
          setErrors(mapped);
        } else {
          throw new Error(json.message ?? "Request failed");
        }
        return;
      }

      onSave(toFrontend(json.data), mode);
    } catch (err) {
      console.error(err);
      setErrors({
        _global: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl shadow-pink-200/40 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-pink-100">
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-pink-100 font-semibold mb-0.5">
              {mode === "create" ? "New Product" : "Edit Product"}
            </p>
            <h2 className="font-serif text-xl text-white">
              {mode === "create" ? "Add to Collection" : form.name || "Untitled"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-6 space-y-5">
          {errors._global && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errors._global}
            </div>
          )}
          <ImageUploadZone
            images={images}
            onAdd={(imgs) => setImages((p) => [...p, ...imgs])}
            onRemove={(id) =>
              setImages((p) => {
                const n = p.filter((i) => i.id !== id);
                if (n.length > 0 && !n.some((i) => i.isPrimary)) n[0].isPrimary = true;
                return n;
              })
            }
            onSetPrimary={(id) =>
              setImages((p) => p.map((i) => ({ ...i, isPrimary: i.id === id })))
            }
          />
          <Field label="Product Name" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Lumière Rose Sérum"
              className={iCls(errors.name)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" error={errors.category}>
              <CategoryCombobox
                value={form.category}
                onChange={(v) => set("category", v)}
                error={errors.category}
              />
            </Field>
            <Field label="Price (USD)" error={errors.price}>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={iCls(errors.price)}
              />
            </Field>
          </div>
          <Field label="Description" error={errors.description}>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Full product description…"
              rows={4}
              className={iCls(errors.description) + " resize-none"}
            />
          </Field>
          <div className="flex items-end gap-8">
            <StockStepper
              value={form.stock}
              onChange={(v) => set("stock", v)}
              error={errors.stock}
            />
            <Toggle
              label="Featured"
              checked={form.featured}
              onChange={(v) => set("featured", v)}
            />
          </div>
        </div>

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
            {saving ? "Saving…" : mode === "create" ? "Add Product" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────

function DeleteModal({
  product,
  onConfirm,
  onClose,
}: {
  product: Product;
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
            <h3 className="font-semibold text-gray-800">Delete Product?</h3>
            <p className="text-xs text-gray-400">This cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Permanently delete{" "}
          <span className="font-semibold text-gray-700">{product.name}</span>?
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
  product,
  onClose,
  onEdit,
}: {
  product: Product;
  onClose: () => void;
  onEdit: () => void;
}) {
  const [activeIdx, setActiveIdx] = useState(
    Math.max(product.images.findIndex((i) => i.isPrimary), 0),
  );
  const images = product.images;
  const active = images[activeIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl shadow-pink-200/40 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-pink-100">
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-pink-100 font-semibold mb-0.5">
              Product Detail
            </p>
            <h2 className="font-serif text-xl text-white truncate max-w-sm">{product.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {images.length > 0 ? (
            <div className="space-y-3">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-pink-50 border border-pink-100">
                <img src={active?.url} alt={product.name} className="w-full h-full object-contain" />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveIdx((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-all"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setActiveIdx((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-all"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveIdx(idx)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${idx === activeIdx ? "bg-pink-500 w-4" : "bg-white/60"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveIdx(idx)}
                      className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${idx === activeIdx ? "border-pink-400" : "border-pink-100 opacity-60 hover:opacity-100"}`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video w-full rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-pink-200" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-pink-50/60 rounded-2xl p-4 border border-pink-100">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold">Price</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">${product.price.toFixed(2)}</p>
            </div>
            <div className="bg-pink-50/60 rounded-2xl p-4 border border-pink-100">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold">Stock</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{product.stock}</p>
              <p className={`text-xs mt-0.5 font-medium ${product.stock === 0 ? "text-red-400" : product.stock <= 5 ? "text-amber-500" : "text-emerald-500"}`}>
                {product.stock === 0 ? "Out of stock" : product.stock <= 5 ? "Low stock" : "In stock"}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold">Category</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-xs text-gray-600 font-medium">
                {product.category}
              </span>
              {product.featured && (
                <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 border border-pink-200 text-xs text-pink-500 font-semibold uppercase tracking-wide">
                  ✦ Featured
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold">Description</span>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <p className="text-[11px] text-gray-300">Added {product.createdAt}</p>
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
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState("");
  const [modal, setModal] = useState<{
    type: "create" | "edit" | "delete" | "view";
    product?: Product;
  } | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? "Failed to load");
        setProducts((json.data as BackendProduct[]).map(toFrontend));
      } catch (err) {
        setFetchErr(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const allCats = Array.from(new Set(products.map((p) => p.category)));
  const filtered = products.filter((p) => {
    const s = search.toLowerCase();
    return (
      (!s || p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s)) &&
      (!catFilter || p.category === catFilter)
    );
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSave = (saved: Product, mode: "create" | "edit") => {
    if (mode === "create") {
      setProducts((p) => [...p, saved]);
      toast({
        title: "Product added",
        description: `"${saved.name}" was added to the catalogue.`,
      });
    } else {
      setProducts((p) => p.map((x) => (x.id === saved.id ? saved : x)));
      toast({
        title: "Changes saved",
        description: `"${saved.name}" was updated successfully.`,
      });
    }
    setModal(null);
  };

  const handleDelete = async () => {
    if (!modal?.product) return;
    const id = modal.product.id;
    const name = modal.product.name;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? "Delete failed");
      }
      setProducts((p) => p.filter((x) => x.id !== id));
      toast({
        title: "Product deleted",
        description: `"${name}" was permanently removed.`,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Something went wrong.",
        variant: "destructive",
      });
    }
    setModal(null);
  };

  // ── Stats ─────────────────────────────────────────────────────────────────

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.stock > 0).length,
    totalUnits: products.reduce((s, p) => s + p.stock, 0),
    featured: products.filter((p) => p.featured).length,
  };

  const statCards = [
    {
      icon: Layers,
      label: "Total Products",
      value: stats.total,
      max: Math.max(stats.total, 1),
      sub: "in catalogue",
      from: "from-pink-500",
      to: "to-rose-400",
      light: "bg-pink-50",
      text: "text-pink-500",
    },
    {
      icon: Archive,
      label: "In Stock",
      value: stats.inStock,
      max: Math.max(stats.total, 1),
      sub: `of ${stats.total} products`,
      from: "from-emerald-400",
      to: "to-teal-400",
      light: "bg-emerald-50",
      text: "text-emerald-500",
    },
    {
      icon: TrendingUp,
      label: "Total Units",
      value: stats.totalUnits,
      max: Math.max(stats.totalUnits, 1),
      sub: "across all products",
      from: "from-violet-400",
      to: "to-purple-500",
      light: "bg-violet-50",
      text: "text-violet-500",
    },
    {
      icon: Sparkles,
      label: "Featured",
      value: stats.featured,
      max: Math.max(stats.total, 1),
      sub: "highlighted products",
      from: "from-amber-400",
      to: "to-orange-400",
      light: "bg-amber-50",
      text: "text-amber-500",
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

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
              <p className="text-3xl font-bold text-gray-800 mb-1">{s.value}</p>
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

      {/* Search + filter + New Product */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-200 rounded-full text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 placeholder:text-gray-300 shadow-sm transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["", ...allCats].map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${catFilter === cat ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200" : "bg-white border border-pink-200 text-gray-500 hover:border-pink-300 hover:text-pink-600"}`}
            >
              {cat && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: catColor(cat) }}
                />
              )}
              {cat || "All"}
            </button>
          ))}
        </div>
        <button
          onClick={() => setModal({ type: "create" })}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-medium rounded-full shadow-md shadow-pink-200 hover:shadow-pink-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          New Product
        </button>
      </div>

      {/* Table / loading / error */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-pink-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading products…</span>
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
          accentColor={(p) => catColor(p.category)}
          onView={(id) => {
            const p = products.find((x) => x.id === id);
            if (p) setModal({ type: "view", product: p });
          }}
          onEdit={(id) => {
            const p = products.find((x) => x.id === id);
            if (p) setModal({ type: "edit", product: p });
          }}
          onDelete={(id) => {
            const p = products.find((x) => x.id === id);
            if (p) setModal({ type: "delete", product: p });
          }}
          columns={[
            {
              key: "name",
              label: "Product",
              width: "1fr",
              headerClassName: "pl-[56px]",
              render: (_, p: Product) => {
                const primary = p.images.find((i) => i.isPrimary) ?? p.images[0];
                return (
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-pink-100 shrink-0 bg-pink-50">
                      {primary ? (
                        <img src={primary.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-pink-200" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                        {p.featured && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 text-pink-500 font-semibold uppercase tracking-wide shrink-0 border border-pink-200">
                            Featured
                          </span>
                        )}
                        {p.images.length > 1 && (
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full shrink-0">
                            +{p.images.length - 1}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{p.description}</p>
                    </div>
                  </div>
                );
              },
            },
            {
              key: "category",
              label: "Category",
              width: "auto",
              render: (_, p: Product) => (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100 whitespace-nowrap">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: catColor(p.category) }}
                  />
                  <span className="text-xs text-gray-600 font-medium">{p.category}</span>
                </div>
              ),
            },
            {
              key: "price",
              label: "Price",
              width: "auto",
              render: (v: number) => (
                <span className="text-sm font-bold text-gray-800 whitespace-nowrap">
                  ${v.toFixed(2)}
                </span>
              ),
            },
            {
              key: "stock",
              label: "Stock",
              width: "auto",
              render: (v: number) => {
                const badge =
                  v === 0
                    ? { label: "Out of Stock", cls: "bg-red-50 text-red-500 border border-red-100" }
                    : v <= 5
                    ? { label: `Low — ${v}`, cls: "bg-amber-50 text-amber-600 border border-amber-100" }
                    : { label: `${v} units`, cls: "bg-emerald-50 text-emerald-600 border border-emerald-100" };
                return (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${badge.cls}`}>
                    {badge.label}
                  </span>
                );
              },
            },
          ]}
        />
      )}

      {modal?.type === "view" && modal.product && (
        <ViewModal
          product={modal.product}
          onClose={() => setModal(null)}
          onEdit={() => setModal({ type: "edit", product: modal.product })}
        />
      )}
      {(modal?.type === "create" || modal?.type === "edit") && (
        <ProductModal
          mode={modal.type}
          product={modal.product}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "delete" && modal.product && (
        <DeleteModal
          product={modal.product}
          onConfirm={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}