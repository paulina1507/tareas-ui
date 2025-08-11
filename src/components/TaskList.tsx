import type { Task } from "../lib/api";
import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
  onEdit,
}: {
  tasks: Task[];
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, title: string, description?: string) => Promise<void>;
}) {
  if (!tasks.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-600 bg-slate-800/50 p-8 text-center">
        <div className="text-lg">No hay tareas para mostrar</div>
        <div className="text-slate-400">Agrega una nueva arriba 👆</div>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
