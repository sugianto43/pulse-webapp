const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default async function Home() {
  const res = await fetch(`${API_URL}/api/analyze/BBCA`, { cache: "no-store" });
  const data = await res.json();

  return (
    <div className="min-h-screen bg-zinc-50 p-8 font-sans dark:bg-black">
      <main className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-2xl font-semibold text-black dark:text-zinc-50">
          Pulse Web — /api/analyze/BBCA
        </h1>
        <pre className="overflow-auto rounded-lg bg-white p-4 text-sm text-black shadow dark:bg-zinc-900 dark:text-zinc-100">
          {JSON.stringify(data, null, 2)}
        </pre>
      </main>
    </div>
  );
}
