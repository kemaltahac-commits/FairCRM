import { useEffect, useState, type FormEvent } from 'react'
import type { Contact, ContactStatus } from '../../types'
import { XMarkIcon } from '../icons/Icons'

export type NewContact = Omit<Contact, 'id'>
export type ContactFormMode = 'create' | 'edit'

interface AddContactModalProps {
  isOpen: boolean
  mode: ContactFormMode
  contact: Contact | null
  onClose: () => void
  onCreate: (contact: NewContact) => void
  onUpdate: (contact: Contact) => void
}

const STATUS_OPTIONS: { value: ContactStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'lead', label: 'Lead' },
  { value: 'customer', label: 'Customer' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'inactive', label: 'Inactive' },
]

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

function getEmptyForm(): NewContact {
  return {
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    status: 'lead',
    lastContact: getTodayDate(),
  }
}

function contactToFormData(contact: Contact): NewContact {
  return {
    firstName: contact.firstName,
    lastName: contact.lastName,
    company: contact.company,
    email: contact.email,
    phone: contact.phone,
    status: contact.status,
    lastContact: contact.lastContact,
  }
}

const inputClassName =
  'h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20'

const labelClassName = 'mb-1.5 block text-sm font-medium text-slate-700'

export function AddContactModal({
  isOpen,
  mode,
  contact,
  onClose,
  onCreate,
  onUpdate,
}: AddContactModalProps) {
  const [formData, setFormData] = useState<NewContact>(getEmptyForm)
  const isEditMode = mode === 'edit'

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && contact) {
        setFormData(contactToFormData(contact))
      } else {
        setFormData(getEmptyForm())
      }
    }
  }, [isOpen, isEditMode, contact])

  if (!isOpen) return null

  function handleChange(field: keyof NewContact, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (isEditMode && contact) {
      onUpdate({ ...formData, id: contact.id })
    } else {
      onCreate(formData)
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        aria-label="Close modal"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-form-title"
        className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 id="contact-form-title" className="text-lg font-semibold text-slate-900">
              {isEditMode ? 'Edit Contact' : 'Add Contact'}
            </h2>
            <p className="text-sm text-slate-500">
              {isEditMode
                ? 'Update the details for this contact.'
                : 'Enter the details for the new contact.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className={labelClassName}>
                First name
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="Sarah"
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="lastName" className={labelClassName}>
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Johnson"
                className={inputClassName}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="company" className={labelClassName}>
                Company
              </label>
              <input
                id="company"
                type="text"
                required
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Acme Corp"
                className={inputClassName}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className={labelClassName}>
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="sarah.johnson@acmecorp.com"
                className={inputClassName}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="phone" className={labelClassName}>
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="5551111111"
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="status" className={labelClassName}>
                Status
              </label>
              <select
                id="status"
                required
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className={inputClassName}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="lastContact" className={labelClassName}>
                Last contact date
              </label>
              <input
                id="lastContact"
                type="date"
                required
                value={formData.lastContact}
                onChange={(e) => handleChange('lastContact', e.target.value)}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isEditMode ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
