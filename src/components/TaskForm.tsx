export default function TaskForm({ onCreate }: { onCreate: (p:{title:string; description?:string})=>Promise<void> }) {
  return (
    <form onSubmit={(e)=>{ e.preventDefault(); }}>
      {/* Por ahora no mostramos nada hasta implementar el formulario real */}
    </form>
  );
}

