import { useState } from "react";
import type { Task } from "../lib/api";

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
}: {
  task: Task;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, title: string, description?: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
  if (!title.trim()) return;
  const ok = window.confirm("¿Guardar cambios de esta tarea?");
  if (!ok) return;
  setSaving(true);
  try {
    await onEdit(task.id, title.trim(), desc.trim() || undefined);
    setEditing(false);
  } finally {
    setSaving(false);
  }
};


  return (
    <li className="group p-4 rounded-2xl border border-slate-700 bg-slate-800/70 shadow hover:border-slate-600 transition flex items-start gap-3">
      <input
        type="checkbox"
        className="mt-1 h-5 w-5 accent-indigo-500"
        checked={task.completed}
        onChange={(e) => onToggle(task.id, e.target.checked)}
        title="Marcar como completada"
      />

      <div className="flex-1">
        {editing ? (
          <div className="flex flex-col gap-2">
            <input
              className="rounded-lg bg-slate-900/60 border border-slate-700 px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="rounded-lg bg-slate-900/60 border border-slate-700 px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="rounded-lg bg-green-600 px-3 py-1 hover:bg-green-500 disabled:opacity-50"
                onClick={save}
                disabled={saving}
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
              <button
                className="rounded-lg bg-slate-700 px-3 py-1 hover:bg-slate-600"
                onClick={() => {
                  setEditing(false);
                  setTitle(task.title);
                  setDesc(task.description ?? "");
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={`font-semibold ${task.completed ? "line-through text-slate-400" : ""}`}>
              {task.title}
            </div>
            {task.description && (
              <div className="text-sm text-slate-300">{task.description}</div>
            )}
            <div className="mt-1 text-xs text-slate-400">
              Actualizada: {new Date(task.updated_at).toLocaleString()}
            </div>
          </>
        )}
      </div>

      {!editing && (
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            className="rounded-lg bg-yellow-500 px-3 py-1 text-slate-900 hover:bg-yellow-400"
            onClick={() => setEditing(true)}
          >
            Editar
          </button>
          <button
            className="rounded-lg bg-rose-600 px-3 py-1 hover:bg-rose-500"
            onClick={() => {
                const ok = window.confirm("¿Eliminar esta tarea? Esta acción no se puede deshacer.");
                if (ok) onDelete(task.id);
            }}
            >
            Eliminar
            </button>

        </div>
      )}
    </li>
  );
}
