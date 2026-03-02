export default function Loading() {
  return (
    <div className="min-h-[160vh] px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-[60vh] rounded-2xl bg-zinc-900/60 border border-zinc-800" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-28 rounded-xl bg-zinc-900/60 border border-zinc-800" />
          <div className="h-28 rounded-xl bg-zinc-900/60 border border-zinc-800" />
          <div className="h-28 rounded-xl bg-zinc-900/60 border border-zinc-800" />
          <div className="h-28 rounded-xl bg-zinc-900/60 border border-zinc-800" />
        </div>
        <div className="h-[40vh] rounded-2xl bg-zinc-900/60 border border-zinc-800" />
        <div className="flex flex-col items-center gap-4 pt-2">
          <div className="w-10 h-10 border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-mono">Loading…</p>
        </div>
      </div>
    </div>
  );
}
