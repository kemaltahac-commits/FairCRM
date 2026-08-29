import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import type { NavItem } from '../../types'

interface DashboardLayoutProps {
  navItems: NavItem[]
  activeNavItem: string
  onNavItemClick: (id: string) => void
  pageTitle: string
  pageSubtitle: string
  children: ReactNode
}

export function DashboardLayout({
  navItems,
  activeNavItem,
  onNavItemClick,
  pageTitle,
  pageSubtitle,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar items={navItems} activeItem={activeNavItem} onItemClick={onNavItemClick} />

      <div className="pl-64">
        <Header title={pageTitle} subtitle={pageSubtitle} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
