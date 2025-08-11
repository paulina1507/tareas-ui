import { useState } from "react";
import type { Task } from "../lib/api";

export default function TaskItem({
  task,
  index,
  onToggle,
  onDelete,
  onEdit,
}: {
  task: Task;
  index: number;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, title: string, description?: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description ?? "");
  const [saving, setSaving] = useState(false);
  const [openMenu, setOpenMenu] = useState(false); // menú móvil

  // rotación suave alternada
  const rot = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2"][index % 4];

  const save = async () => {
    if (!title.trim()) return;
    if (!confirm("¿Guardar cambios de esta tarea?")) return;
    setSaving(true);
    try {
      await onEdit(task.id, title.trim(), desc.trim() || undefined);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
          <li
  className={[
    "w-1/2 max-w-sm py-8",                
    "h-full relative rounded-xl pb-8 min-h-[180px]",
    "bg-[#fff9c4] note-texture note-shadow border border-yellow-300",
    "hover:rotate-0 hover:scale-[1.01] transition-transform",
    task.completed ? "opacity-85" : "",
  ].join(" ")}
>
      {/* cinta adhesiva */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-4 w-16 bg-[#fffae3] rounded-sm shadow" />

      {/* cabecera: checkbox + título/desc */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 accent-emerald-600"
          checked={task.completed}
          onChange={(e) => onToggle(task.id, e.target.checked)}
          title="Completar ✅"
        />

        <div className="flex-1">
          {editing ? (
            <div className="flex flex-col gap-2">
              <input
                className="rounded-md border border-yellow-400/80 bg-[#fffae3] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="rounded-md border border-yellow-400/80 bg-[#fffae3] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={save}
                  disabled={saving}
                  className="bg-[#E9967A] text-white px-3 py-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50"
                  title="Guardar 💾"
                >
                  {saving ? "Guardando…" : "Guardar ✅"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setTitle(task.title);
                    setDesc(task.description ?? "");
                  }}
                  className="bg-[#E9967A] text-white px-3 py-1 rounded-full bg-amber-400/80 hover:bg-amber-400"
                  title="Cancelar"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={`font-semibold ${task.completed ? "line-through decoration-2" : ""}`}>
                {task.title}
              </div>
              {task.description && <div className="text-sm mt-1 opacity-90">{task.description}</div>}
              <div className="text-xs mt-2 opacity-70">
                Actualizada: {new Date(task.updated_at).toLocaleString()}
              </div>
            </>
          )}
        </div>

        {/* menú de acciones en móvil (tres puntos) */}
        {!editing && (
          <div className="sm:hidden relative">
            <button
              onClick={() => setOpenMenu((v) => !v)}
              className="bg-[#E9967A] text-white px-2 py-1 rounded-full bg-amber-300/70 hover:bg-amber-300"
              title="Acciones"
            >
              ⋯
            </button>
            {openMenu && (
              <div className="absolute right-0 mt-2 w-36 rounded-lg bg-white shadow-lg ring-1 ring-black/10 text-slate-800 z-10">
                <button
                  onClick={() => { setOpenMenu(false); setEditing(true); }}
                  className="bg-[#fffae3] text-white w-full text-left px-3 py-2 hover:bg-amber-50"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => {
                    setOpenMenu(false);
                    if (confirm("¿Eliminar esta tarea?")) onDelete(task.id);
                  }}
                  className="bg-[#fffae3] text-white w-full text-left px-3 py-2 text-rose-700 hover:bg-rose-50"
                >
                  🗑️ Eliminar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* acciones en desktop (abajo a la derecha) */}
      {!editing && (
        <div className="hidden sm:flex absolute bottom-3 right-3 gap-2">
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900"
            title="Editar ✏️"
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => { if (confirm("¿Eliminar esta tarea?")) onDelete(task.id); }}
            className="px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white"
            title="Eliminar 🗑️"
          >
            🗑️ Eliminar
          </button>
        </div>
      )}
    </li>
  );
}



