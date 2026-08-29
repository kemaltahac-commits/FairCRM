import { useMemo, useState } from 'react'
import type { Contact } from '../types'
import {
  AddContactModal,
  type ContactFormMode,
  type NewContact,
} from '../components/contacts/AddContactModal'
import { ContactsTable } from '../components/contacts/ContactsTable'
import { PlusIcon, SearchIcon } from '../components/icons/Icons'

interface ContactsPageProps {
  contacts: Contact[]
  onAddContact: (contact: NewContact) => void
  onUpdateContact: (contact: Contact) => void
  onDeleteContact: (id: string) => void
}

function filterContacts(contacts: Contact[], query: string): Contact[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return contacts

  return contacts.filter((contact) => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase()
    return (
      fullName.includes(normalized) ||
      contact.company.toLowerCase().includes(normalized) ||
      contact.email.toLowerCase().includes(normalized) ||
      contact.status.toLowerCase().includes(normalized)
    )
  })
}

export function ContactsPage({
  contacts,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
}: ContactsPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ContactFormMode>('create')
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  const filteredContacts = useMemo(
    () => filterContacts(contacts, searchQuery),
    [contacts, searchQuery],
  )

  function openCreateModal() {
    setModalMode('create')
    setEditingContact(null)
    setIsModalOpen(true)
  }

  function openEditModal(contact: Contact) {
    setModalMode('edit')
    setEditingContact(contact)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingContact(null)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              {filteredContacts.length} of {contacts.length} contacts
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add Contact
          </button>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="relative max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, company, or email..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <ContactsTable
            contacts={filteredContacts}
            onEditContact={openEditModal}
            onDeleteContact={onDeleteContact}
          />
        </section>
      </div>

      <AddContactModal
        isOpen={isModalOpen}
        mode={modalMode}
        contact={editingContact}
        onClose={closeModal}
        onCreate={onAddContact}
        onUpdate={onUpdateContact}
      />
    </>
  )
}
