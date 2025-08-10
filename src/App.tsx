import { useEffect, useState } from "react";
import { api, type Task } from "./lib/api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./index.css";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [sort, setSort] = useState<"date" | "title">("date");

  useEffect(() => {
    api.list().then(setTasks).catch(e=>setError(e.message)).finally(()=>setLoading(false));
  }, []);

  const onCreate = async (p:{title:string; description?:string}) => {
    const t = await api.create(p);
    setTasks(prev => [t, ...prev]);
  };
  const onToggle = async (id:number, completed:boolean) => {
    const t = await api.update(id, { completed });
    setTasks(prev => prev.map(x => x.id === id ? t : x));
  };
  const onDelete = async (id:number) => {
    await api.remove(id);
    setTasks(prev => prev.filter(x => x.id !== id));
  };
  const onEdit = async (id:number, title:string, description?:string) => {
    const t = await api.update(id, { title, description: description ?? null as any });
    setTasks(prev => prev.map(x => x.id === id ? t : x));
  };

  // Filtro + búsqueda + orden
  const filteredTasks = tasks
    .filter(t => {
      if (filter === "completed") return t.completed;
      if (filter === "pending") return !t.completed;
      return true;
    })
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100">
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-3">
          {[...Array(4)].map((_,i)=>(
            <div key={i} className="h-16 rounded-2xl bg-slate-700/40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Error: {error}</p>
          <button
            onClick={()=>location.reload()}
            className="mt-4 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Tareas</h1>
            <p className="text-slate-300 mt-1">
              Total: {tasks.length} — Completadas: {tasks.filter(t=>t.completed).length} — Pendientes: {tasks.filter(t=>!t.completed).length}
            </p>
          </div>
        </header>

        {/* Barra de búsqueda y filtros */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <input
            placeholder="Buscar tareas…"
            className="flex-1 rounded-xl bg-slate-700/60 border border-slate-600 px-3 py-2 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="rounded-xl bg-slate-700/60 border border-slate-600 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">Todas</option>
            <option value="completed">Completadas</option>
            <option value="pending">Pendientes</option>
          </select>
          <select
            className="rounded-xl bg-slate-700/60 border border-slate-600 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
          >
            <option value="date">Más recientes</option>
            <option value="title">Por título</option>
          </select>
        </div>

        {/* Formulario */}
        <TaskForm onCreate={onCreate} />

        {/* Lista */}
        <div className="mt-4 space-y-3">
          {!filteredTasks.length ? (
            <div className="rounded-2xl border border-dashed border-slate-600 bg-slate-800/50 p-8 text-center">
              <div className="text-lg">No hay tareas para mostrar</div>
              <div className="text-slate-400">Agrega una nueva arriba 👆</div>
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
