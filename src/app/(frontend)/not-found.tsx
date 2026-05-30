import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="relative w-screen text-white">
      <div className="flex flex-col w-full px-5 gap-5 lg:flex-row lg:px-40 pt-20">
        <div className="flex flex-col w-full h-full gap-2">
          <div className="relative flex flex-col bg-slate-900 p-10 pt-8 gap-2">
            <h1 className="text-2xl mb-2 text-white">404 NOT FOUND</h1>

            <div className="relative flex flex-col">
              <p>This page could not be found.</p>
            </div>
            <button>
              <Link href="/">Go home</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
