import type { Contact } from '../../types'
import { PencilIcon, TrashIcon } from '../icons/Icons'
import { StatusBadge } from './StatusBadge'

interface ContactsTableProps {
  contacts: Contact[]
  onEditContact: (contact: Contact) => void
  onDeleteContact: (id: string) => void
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

export function ContactsTable({ contacts, onEditContact, onDeleteContact }: ContactsTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-sm font-medium text-slate-900">No contacts found</p>
        <p className="mt-1 text-sm text-slate-500">Try adjusting your search terms.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Last Contact
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {contacts.map((contact) => (
            <tr key={contact.id} className="transition-colors hover:bg-slate-50">
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                    {getInitials(contact.firstName, contact.lastName)}
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {contact.firstName} {contact.lastName}
                  </span>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {contact.company}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {contact.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <StatusBadge status={contact.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                {formatDate(contact.lastContact)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEditContact(contact)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
                    aria-label={`Edit ${contact.firstName} ${contact.lastName}`}
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const confirmed = window.confirm(
                        `Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`,
                      )
                      if (confirmed) {
                        onDeleteContact(contact.id)
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    aria-label={`Delete ${contact.firstName} ${contact.lastName}`}
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
