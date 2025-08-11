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
  return (
    <ul
  className="
    grid
    grid-cols-1         /* móvil */
    sm:grid-cols-2      /* tablet */
    lg:grid-cols-3      /* PC */
    gap-x-8 gap-y-4     /* espacio entre post-it */
    justify-items-center /* centra cada tarjeta en su celda */
    w-full
  "
>
  {tasks.map((t, i) => (
    <TaskItem
      key={t.id}
      task={t}
      index={i}
      onToggle={onToggle}
      onDelete={onDelete}
      onEdit={onEdit}
    />
  ))}
</ul>

  );
}

















