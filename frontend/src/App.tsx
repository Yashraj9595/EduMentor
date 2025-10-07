import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-indigo-500" />
              <span className="text-lg font-semibold">EduMentor</span>
            </div>
            <nav className="hidden gap-6 text-sm md:flex">
              <a className="text-slate-300 hover:text-white" href="#features">Features</a>
              <a className="text-slate-300 hover:text-white" href="#docs">Docs</a>
              <a className="text-slate-300 hover:text-white" href="#about">About</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <section className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            Vite + React + TypeScript
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Tailwind CSS is configured. Edit <code className="font-mono">src/App.tsx</code> and
            <code className="mx-1 font-mono">src/index.css</code> to get started.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onClick={() => setCount((value) => value + 1)}
            >
              Count: {count}
            </button>
            <a
              href="https://tailwindcss.com/docs"
              target="_blank"
              className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-slate-200 hover:border-white/30"
            >
              Tailwind Docs
            </a>
            <a
              href="https://vite.dev/guide/"
              target="_blank"
              className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-slate-200 hover:border-white/30"
            >
              Vite Guide
            </a>
          </div>
        </section>

        <section className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Utility-first</h3>
            <p className="mt-2 text-sm text-slate-300">Rapidly build modern UIs with composable classes.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Dark-mode ready</h3>
            <p className="mt-2 text-sm text-slate-300">This starter uses a dark gradient background by default.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">PWA-friendly</h3>
            <p className="mt-2 text-sm text-slate-300">We can add PWA in the next step with a single plugin.</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} EduMentor. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default App
