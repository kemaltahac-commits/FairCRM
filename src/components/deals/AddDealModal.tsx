import { useEffect, useState, type FormEvent } from 'react'
import type { Contact, Deal, DealStage } from '../../types'
import { XMarkIcon } from '../icons/Icons'

export type NewDeal = Omit<Deal, 'id' | 'created_at'>
export type DealFormMode = 'create' | 'edit'

interface AddDealModalProps {
  isOpen: boolean
  mode: DealFormMode
  deal: Deal | null
  contacts: Contact[]
  onClose: () => void
  onCreate: (deal: NewDeal) => void
  onUpdate: (deal: Deal) => void
}

const STAGE_OPTIONS: { value: DealStage; label: string }[] = [
  { value: 'lead', label: 'Lead' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
]

const inputClassName =
  'h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20'

const labelClassName = 'mb-1.5 block text-sm font-medium text-slate-700'

function getEmptyForm(): NewDeal {
  return {
    title: '',
    contact_id: '',
    value: 0,
    stage: 'lead',
  }
}

function dealToFormData(deal: Deal): NewDeal {
  return {
    title: deal.title,
    contact_id: deal.contact_id,
    value: deal.value,
    stage: deal.stage,
  }
}

export function AddDealModal({
  isOpen,
  mode,
  deal,
  contacts,
  onClose,
  onCreate,
  onUpdate,
}: AddDealModalProps) {
  const [formData, setFormData] = useState<NewDeal>(getEmptyForm)
  const isEditMode = mode === 'edit'

  useEffect(() => {
    if (isOpen) {
      setFormData(isEditMode && deal ? dealToFormData(deal) : getEmptyForm())
    }
  }, [isOpen, isEditMode, deal])

  if (!isOpen) return null

  function handleChange(field: 'title' | 'contact_id' | 'stage', value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (isEditMode && deal) {
      onUpdate({ ...formData, id: deal.id, created_at: deal.created_at })
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
        aria-labelledby="deal-form-title"
        className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 id="deal-form-title" className="text-lg font-semibold text-slate-900">
              {isEditMode ? 'Edit Deal' : 'Add Deal'}
            </h2>
            <p className="text-sm text-slate-500">
              {isEditMode ? 'Update the details for this deal.' : 'Enter the details for the new deal.'}
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
          <div className="space-y-4">
            <div>
              <label htmlFor="deal-title" className={labelClassName}>
                Title
              </label>
              <input
                id="deal-title"
                type="text"
                required
                value={formData.title}
                onChange={(event) => handleChange('title', event.target.value)}
                placeholder="Website Redesign"
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="deal-contact" className={labelClassName}>
                Contact
              </label>
              <select
                id="deal-contact"
                required
                value={formData.contact_id}
                onChange={(event) => handleChange('contact_id', event.target.value)}
                className={inputClassName}
              >
                <option value="" disabled>
                  Select a contact
                </option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.firstName} {contact.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="deal-value" className={labelClassName}>
                  Value
                </label>
                <input
                  id="deal-value"
                  type="number"
                  min="0"
                  required
                  value={formData.value}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, value: Number(event.target.value) }))
                  }
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="deal-stage" className={labelClassName}>
                  Stage
                </label>
                <select
                  id="deal-stage"
                  required
                  value={formData.stage}
                  onChange={(event) => handleChange('stage', event.target.value)}
                  className={inputClassName}
                >
                  {STAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
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
              {isEditMode ? 'Save Changes' : 'Add Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
