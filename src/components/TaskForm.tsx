import { useState } from "react";

export default function TaskForm({
  onCreate,
}: {
  onCreate: (p: { title: string; description?: string }) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    const d = desc.trim();
    if (!t) return;
    setLoading(true);
    try {
      await onCreate({ title: t, description: d || undefined });
      setTitle("");
      setDesc("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white/95 text-slate-900 rounded-2xl shadow p-4 flex flex-col gap-3"
    >
      <input
        className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Título de la tarea *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Descripción (opcional)"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="rounded-xl bg-indigo-600 text-white px-4 py-2 font-medium hover:bg-indigo-500 disabled:opacity-50 transition"
        >
          {loading ? "Agregando…" : "Agregar tarea"}
        </button>
      </div>
    </form>
  );
}

