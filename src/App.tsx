import { useEffect, useState } from "react";
import { api, type Task } from "./lib/api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { ToastProvider, useToast } from "./components/Toast";
import "./index.css";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [sort, setSort] = useState<"date" | "title">("date");

  const toast = useToast();

  useEffect(() => {
    api
      .list()
      .then(setTasks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const onCreate = async (p: { title: string; description?: string }) => {
    try {
      const t = await api.create(p);
      setTasks((prev) => [t, ...prev]);
      toast({ type: "success", message: "Tarea creada ✅" });
    } catch (e: any) {
      toast({ type: "error", message: `Error al crear: ${e.message || e}` });
    }
  };

  const onToggle = async (id: number, completed: boolean) => {
    try {
      const t = await api.update(id, { completed });
      setTasks((prev) => prev.map((x) => (x.id === id ? t : x)));
      toast({
        type: "success",
        message: completed ? "Tarea completada ✅" : "Marcada como pendiente",
      });
    } catch (e: any) {
      toast({ type: "error", message: `Error al actualizar: ${e.message || e}` });
    }
  };

  const onDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar esta tarea?")) return;
    try {
      await api.remove(id);
      setTasks((prev) => prev.filter((x) => x.id !== id));
      toast({ type: "success", message: "Tarea eliminada 🗑️" });
    } catch (e: any) {
      toast({ type: "error", message: `Error al eliminar: ${e.message || e}` });
    }
  };

  const onEdit = async (id: number, title: string, description?: string) => {
    if (!window.confirm("¿Guardar cambios de esta tarea?")) return;
    try {
      const t = await api.update(id, { title, description: description ?? (null as any) });
      setTasks((prev) => prev.map((x) => (x.id === id ? t : x)));
      toast({ type: "success", message: "Cambios guardados 💾" });
    } catch (e: any) {
      toast({ type: "error", message: `Error al guardar: ${e.message || e}` });
    }
  };

  const filteredTasks = tasks
    .filter((t) =>
      filter === "completed" ? t.completed : filter === "pending" ? !t.completed : true
    )
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === "title"
        ? a.title.localeCompare(b.title)
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const done = tasks.filter((t) => t.completed).length;
  const pct = tasks.length ? Math.round((done * 100) / tasks.length) : 0;

  if (loading) {
    return (
      <ToastProvider>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100">
          <p className="text-lg">Cargando tareas…</p>
        </div>
      </ToastProvider>
    );
  }

  if (error) {
    return (
      <ToastProvider>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => location.reload()}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 transition"
          >
            Reintentar
          </button>
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      {/* Marco principal centrado */}
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100">
        {/* Contenido centrado y con ancho máximo */}
        <div className="w-2/3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header + controles en bloque centrado estrecho */}
          <div className="mx-auto max-w-7xl text-center space-y-6">
            <h1 className="text-5xl font-extrabold">Gestor de Tareas</h1>
            <p className="text-slate-300">
              Total: {tasks.length} — Completadas: {done} — Pendientes: {tasks.length - done}
            </p>

            {tasks.length > 0 && (
              <>
                <div className="mt-3 h-2 w-full rounded bg-slate-700 overflow-hidden">
                  <div
                    className="h-2 bg-emerald-500 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">{pct}% completado</p>
              </>
            )}

            {/* Buscador + filtros */}
            <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="relative">
                {/* Icono pequeño para evitar el bug del SVG gigante */}
                <svg
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  width="16"
                  height="16"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
                  />
                </svg>

                <input
                  placeholder="Buscar tareas…"
                  className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 pl-9 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { k: "all", label: "Todas" },
                  { k: "completed", label: "Completadas" },
                  { k: "pending", label: "Pendientes" },
                ].map((t) => (
                  <button
                    key={t.k}
                    onClick={() => setFilter(t.k as any)}
                    className={`px-3 py-1 rounded-full border text-sm transition ${
                      filter === (t.k as any)
                        ? "bg-indigo-600 text-white border-transparent"
                        : "bg-slate-900/60 border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}

                <select
                  className="rounded-full bg-slate-900/60 border border-slate-700 px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                >
                  <option value="date">Más recientes</option>
                  <option value="title">Por título</option>
                </select>
              </div>
            </section>

            {/* Formulario */}
            <TaskForm onCreate={onCreate} />
          </div>

          {/* Lista*/}
          <section className="w-full mt-10">
  <div className="mx-auto max-w-7xl px-4">
    <TaskList
      tasks={filteredTasks}
      onToggle={onToggle}
      onDelete={onDelete}
      onEdit={onEdit}
    />
  </div>
</section>
        </div>
      </div>
    </ToastProvider>
  );
}







