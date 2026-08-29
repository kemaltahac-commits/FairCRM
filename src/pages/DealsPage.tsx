import { useMemo, useState } from 'react'
import { AddDealModal, type DealFormMode, type NewDeal } from '../components/deals/AddDealModal'
import { DealsTable } from '../components/deals/DealsTable'
import { PlusIcon, SearchIcon } from '../components/icons/Icons'
import type { Contact, Deal } from '../types'

interface DealsPageProps {
  deals: Deal[]
  contacts: Contact[]
  onAddDeal: (deal: NewDeal) => void
  onUpdateDeal: (deal: Deal) => void
  onDeleteDeal: (id: string) => void
}

function filterDeals(deals: Deal[], contacts: Contact[], query: string): Deal[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return deals

  return deals.filter((deal) => {
    const contact = contacts.find((item) => item.id === deal.contact_id)
    const contactName = contact ? `${contact.firstName} ${contact.lastName}`.toLowerCase() : ''
    return (
      deal.title.toLowerCase().includes(normalized) ||
      contactName.includes(normalized) ||
      deal.stage.toLowerCase().includes(normalized)
    )
  })
}

export function DealsPage({ deals, contacts, onAddDeal, onUpdateDeal, onDeleteDeal }: DealsPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<DealFormMode>('create')
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)

  const filteredDeals = useMemo(
    () => filterDeals(deals, contacts, searchQuery),
    [deals, contacts, searchQuery],
  )

  function openCreateModal() {
    setModalMode('create')
    setEditingDeal(null)
    setIsModalOpen(true)
  }

  function openEditModal(deal: Deal) {
    setModalMode('edit')
    setEditingDeal(deal)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingDeal(null)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {filteredDeals.length} of {deals.length} deals
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add Deal
          </button>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="relative max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by title, contact, or stage..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <DealsTable
            deals={filteredDeals}
            contacts={contacts}
            onEditDeal={openEditModal}
            onDeleteDeal={onDeleteDeal}
          />
        </section>
      </div>

      <AddDealModal
        isOpen={isModalOpen}
        mode={modalMode}
        deal={editingDeal}
        contacts={contacts}
        onClose={closeModal}
        onCreate={onAddDeal}
        onUpdate={onUpdateDeal}
      />
    </>
  )
}
