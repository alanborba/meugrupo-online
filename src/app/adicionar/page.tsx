"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

export default function AdicionarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    link: "",
    category: "",
    image_url: "",
    tags: "",
  });

  const handleImageSelect = useCallback((file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Formato inválido. Use JPG, PNG, WebP ou GIF." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Arquivo muito grande. Máximo 5MB." }));
      return;
    }
    setErrors((prev) => { const { image, ...rest } = prev; return rest; });
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  }, [handleImageSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nome é obrigatório";
    if (form.name.length > 80) e.name = "Máximo de 80 caracteres";
    if (!form.description.trim()) e.description = "Descrição é obrigatória";
    if (form.description.length > 500) e.description = "Máximo de 500 caracteres";
    if (!form.link.trim()) e.link = "Link é obrigatório";
    if (form.link && !form.link.startsWith("http")) e.link = "Link deve começar com http";
    if (!form.category) e.category = "Selecione uma categoria";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      let imageUrl = form.image_url;

      // Upload image if selected
      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        }
        setUploading(false);
      }

      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          image_url: imageUrl,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      if (res.ok) {
        const group = await res.json();
        setSuccess(group.id);
      }
    } catch {
      alert("Erro ao cadastrar grupo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="hero-bg min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-3xl p-12 text-center max-w-md w-full animate-count-up">
          <span className="text-7xl block mb-6">🎉</span>
          <h2 className="text-2xl font-bold text-white mb-3">
            Grupo cadastrado com sucesso!
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm mb-8">
            Seu grupo já está visível na plataforma. Quer dar um boost e aparecer no topo?
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push(`/promover/${success}`)}
              className="px-8 py-4 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[var(--color-accent-primary)]/30 animate-pulse-glow"
            >
              🚀 Promover Meu Grupo
            </button>
            <button
              onClick={() => router.push(`/grupo/${success}`)}
              className="px-8 py-3 rounded-xl glass text-white font-medium hover:bg-white/10 transition-all"
            >
              Ver meu grupo →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Adicionar <span className="gradient-text">Grupo</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm">
            Preencha as informações do seu grupo para divulgá-lo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Nome do Grupo *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Marketing Digital Brasil"
              className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors text-sm"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Descrição *
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Descreva seu grupo, o que as pessoas vão encontrar..."
              rows={4}
              className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors text-sm resize-none"
            />
            <div className="flex justify-between mt-1">
              {errors.description && (
                <p className="text-red-400 text-xs">{errors.description}</p>
              )}
              <span className="text-xs text-[var(--color-text-muted)] ml-auto">
                {form.description.length}/500
              </span>
            </div>
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Link do Grupo *
            </label>
            <input
              type="url"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors text-sm"
            />
            {errors.link && (
              <p className="text-red-400 text-xs mt-1">{errors.link}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Categoria *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.value })}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                    form.category === cat.value
                      ? "text-white border-transparent shadow-lg"
                      : "bg-white/5 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
                  }`}
                  style={
                    form.category === cat.value
                      ? { background: cat.color, boxShadow: `0 8px 25px ${cat.color}40` }
                      : undefined
                  }
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-red-400 text-xs mt-2">{errors.category}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Imagem do Grupo{" "}
              <span className="text-[var(--color-text-muted)]">(opcional)</span>
            </label>

            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-[var(--color-border)]">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-red-500 text-white flex items-center justify-center transition-colors text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-48 rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10 scale-[1.02]"
                    : "border-[var(--color-border)] bg-white/5 hover:border-[var(--color-border-hover)] hover:bg-white/8"
                }`}
              >
                <div className={`text-4xl transition-transform ${isDragging ? "scale-125" : ""}`}>
                  📷
                </div>
                <div className="text-center">
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {isDragging ? (
                      <span className="text-[var(--color-accent-primary)] font-medium">Solte a imagem aqui</span>
                    ) : (
                      <>
                        <span className="text-[var(--color-accent-secondary)] font-medium">Clique para enviar</span>{" "}
                        ou arraste e solte
                      </>
                    )}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    JPG, PNG, WebP ou GIF • Máx. 5MB
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelect(file);
              }}
            />

            {errors.image && (
              <p className="text-red-400 text-xs mt-2">{errors.image}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Tags{" "}
              <span className="text-[var(--color-text-muted)]">
                (separadas por vírgula, opcional)
              </span>
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="marketing, digital, seo"
              className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors text-sm"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl gradient-bg text-white font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-[var(--color-accent-primary)]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Cadastrando...
              </span>
            ) : (
              "Cadastrar Grupo"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
