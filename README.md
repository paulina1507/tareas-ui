📋 **Gestor de Tareas — Interfaz y Consumo de API**

Este proyecto es una interfaz en React + TailwindCSS para consumir una API REST de gestión de tareas.
Permite crear, listar, editar, completar y eliminar tareas con una experiencia visual tipo post-it.

🚀 **Tecnologías utilizadas**

React + Vite
TypeScript
TailwindCSS
Fetch API para llamadas HTTP

📡 **API REST — Endpoints**

La API expone los siguientes endpoints:

**Método	Endpoint	Descripción**

GET	/tasks	Lista todas las tareas.
POST	/tasks	Crea una nueva tarea.
PUT	/tasks/:id	Actualiza una tarea existente.
DELETE	/tasks/:id	Elimina una tarea.

📦 **Estructura de una tarea (Task)**

type Task = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

🖥️ **Flujo de la interfaz**

Carga inicial
useEffect llama a api.list() y guarda el resultado en el estado tasks.

Crear tarea
El formulario (TaskForm) llama a api.create().
Si es exitoso, la nueva tarea se agrega al inicio de la lista.

Editar tarea
TaskItem permite activar el modo edición.
Al guardar, se llama a api.update().

Completar tarea
Al marcar/desmarcar el checkbox, se envía un PUT con el estado completed.

Eliminar tarea
Al confirmar, se llama a api.remove() y se elimina del estado local.

🎨 **Características visuales**

Diseño tipo post-it amarillo con sombra y ligera rotación.

🔧 **Instalación y uso**

# Clonar repositorio
git clone https://github.com/usuario/gestor-tareas.git
cd gestor-tareas

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
