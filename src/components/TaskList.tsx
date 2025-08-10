import type { Task } from "../lib/api";
export default function TaskList({ tasks }: { tasks: Task[] }) {
  return <ul>{tasks.map(t => <li key={t.id}>{t.title}</li>)}</ul>;
}
