import React from 'react'

export default function Pagination({ page, setPage, totalPages }) {
  if (totalPages <= 1) return null

  const prev = () => setPage(p => Math.max(1, p - 1))
  const next = () => setPage(p => Math.min(totalPages, p + 1))

  // show up to 5 page numbers
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, start + 4)
  const pages = []
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <nav className="flex items-center justify-center gap-2 mt-6">
      <button onClick={prev} className="px-3 py-1 rounded border">Prev</button>
      {pages.map(n => (
        <button
          key={n}
          onClick={() => setPage(n)}
          className={`px-3 py-1 rounded ${n === page ? 'bg-slate-800 text-white' : 'bg-white border'}`}
        >
          {n}
        </button>
      ))}
      <button onClick={next} className="px-3 py-1 rounded border">Next</button>
    </nav>
  )
}
