const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export type Task = {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`${res.status} ${res.statusText} — ${txt}`);
  }
  return res.status === 204 ? (undefined as unknown as T) : await res.json();
}

export const api = {
  list: () => http<Task[]>("/tasks"),
  create: (data: { title: string; description?: string }) =>
    http<Task>("/tasks", { method: "POST", body: JSON.stringify(data) }),
  update: (
    id: number,
    data: Partial<Pick<Task, "title" | "description" | "completed">>
  ) => http<Task>(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: number) => http<void>(`/tasks/${id}`, { method: "DELETE" }),
};
