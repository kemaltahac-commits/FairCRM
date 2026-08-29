import type { Contact, Deal } from '../../types'
import { PencilIcon, TrashIcon } from '../icons/Icons'

interface DealsTableProps {
  deals: Deal[]
  contacts: Contact[]
  onEditDeal: (deal: Deal) => void
  onDeleteDeal: (id: string) => void
}

function getContactName(contactId: string, contacts: Contact[]): string {
  const contact = contacts.find((item) => item.id === contactId)
  return contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown contact'
}

function formatValue(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatStage(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1)
}

export function DealsTable({ deals, contacts, onEditDeal, onDeleteDeal }: DealsTableProps) {
  if (deals.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-sm font-medium text-slate-900">No deals found</p>
        <p className="mt-1 text-sm text-slate-500">Try adjusting your search terms.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {['Title', 'Contact', 'Value', 'Stage'].map((heading) => (
              <th
                key={heading}
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {heading}
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {deals.map((deal) => (
            <tr key={deal.id} className="transition-colors hover:bg-slate-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                {deal.title}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {getContactName(deal.contact_id, contacts)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {formatValue(deal.value)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {formatStage(deal.stage)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEditDeal(deal)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
                    aria-label={`Edit ${deal.title}`}
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${deal.title}?`)) {
                        onDeleteDeal(deal.id)
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    aria-label={`Delete ${deal.title}`}
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
