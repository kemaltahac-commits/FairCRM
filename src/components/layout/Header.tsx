import { BellIcon, SearchIcon } from '../icons/Icons'

interface HeaderProps {
  title: string
  subtitle: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search contacts, deals..."
            className="h-10 w-72 rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Notifications"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">Alex Morgan</p>
            <p className="text-xs text-slate-500">Sales Manager</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            AM
          </div>
        </div>
      </div>
    </header>
  )
}
