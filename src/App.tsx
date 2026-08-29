import { TasksPage } from './pages/TasksPage'
import { useEffect, useState } from 'react'
import { DashboardLayout } from './components/layout/DashboardLayout'
import type { NewContact } from './components/contacts/AddContactModal'
import type { NewDeal } from './components/deals/AddDealModal'
import { navItems, recentActivities } from './data/mockData'
import { pageMeta } from './data/pageMeta'
import { ContactsPage } from './pages/ContactsPage'
import { DashboardPage } from './pages/DashboardPage'
import { DealsPage } from './pages/DealsPage'
import type { Contact, Deal, StatCardData } from './types'

interface DashboardData {
  total_contacts: number
  total_deals: number
  total_value: number
  won_deals: number
}

function App() {
  const [activeNavItem, setActiveNavItem] = useState('dashboard')

  const [contacts, setContacts] = useState<Contact[]>([])
  const [deals, setDeals] = useState<Deal[]>([])

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    total_contacts: 0,
    total_deals: 0,
    total_value: 0,
    won_deals: 0,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  const dashboardStats: StatCardData[] = [
    {
      id: 'contacts',
      label: 'Total Contacts',
      value: String(dashboardData.total_contacts),
      change: '',
      changeType: 'neutral',
      icon: 'contacts',
    },
    {
      id: 'deals',
      label: 'Total Deals',
      value: String(dashboardData.total_deals),
      change: '',
      changeType: 'neutral',
      icon: 'deals',
    },
    {
      id: 'revenue',
      label: 'Total Value',
      value: String(dashboardData.total_value),
      change: '',
      changeType: 'neutral',
      icon: 'revenue',
    },
    {
      id: 'won-deals',
      label: 'Won Deals',
      value: String(dashboardData.won_deals),
      change: '',
      changeType: 'neutral',
      icon: 'tasks',
    },
  ]

  // =========================
  // LOAD INITIAL DATA
  // =========================

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        setLoadError(false)

        const [contactsRes, dealsRes, dashboardRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/contacts'),
          fetch('http://127.0.0.1:8000/deals'),
          fetch('http://127.0.0.1:8000/dashboard'),
        ])

        if (!contactsRes.ok || !dealsRes.ok || !dashboardRes.ok) {
          throw new Error('Failed to load application data')
        }

        const contactsData: Contact[] = await contactsRes.json()
        const dealsData: Deal[] = await dealsRes.json()
        const dashboardData: DashboardData = await dashboardRes.json()

        setContacts(contactsData)
        setDeals(dealsData)
        setDashboardData(dashboardData)
      } catch (error) {
        console.error('Failed to load application data:', error)
        setLoadError(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // =========================
  // CONTACTS
  // =========================

  async function handleAddContact(newContact: NewContact) {
    try {
      const res = await fetch('http://127.0.0.1:8000/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContact),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error('POST /contacts failed:', errorData)
        return
      }

      const savedContact: Contact = await res.json()

      setContacts((prev) => [savedContact, ...prev])

      await refreshDashboard()
    } catch (error) {
      console.error('Request failed:', error)
    }
  }

  async function handleUpdateContact(updatedContact: Contact) {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/contacts/${updatedContact.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: updatedContact.firstName,
            lastName: updatedContact.lastName,
            company: updatedContact.company,
            email: updatedContact.email,
            phone: updatedContact.phone,
            status: updatedContact.status,
            lastContact: updatedContact.lastContact,
          }),
        },
      )

      if (!res.ok) {
        const errorData = await res.json()
        console.error('PUT /contacts failed:', errorData)
        return
      }

      const savedContact: Contact = await res.json()

      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === savedContact.id ? savedContact : contact,
        ),
      )
    } catch (error) {
      console.error('Request failed:', error)
    }
  }

  async function handleDeleteContact(id: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this contact?',
    )

    if (!confirmed) return

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/contacts/${id}`,
        {
          method: 'DELETE',
        },
      )

      if (!res.ok) {
        const errorData = await res.json()
        console.error('DELETE /contacts failed:', errorData)
        return
      }

      setContacts((prev) =>
        prev.filter((contact) => contact.id !== id),
      )

      await refreshDashboard()
    } catch (error) {
      console.error('Request failed:', error)
    }
  }

  // =========================
  // DEALS
  // =========================

  async function handleAddDeal(newDeal: NewDeal) {
    try {
      const res = await fetch('http://127.0.0.1:8000/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDeal),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error('POST /deals failed:', errorData)
        return
      }

      const savedDeal: Deal = await res.json()

      setDeals((prev) => [savedDeal, ...prev])

      await refreshDashboard()
    } catch (error) {
      console.error('Request failed:', error)
    }
  }

  async function handleUpdateDeal(updatedDeal: Deal) {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/deals/${updatedDeal.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: updatedDeal.title,
            contact_id: updatedDeal.contact_id,
            value: updatedDeal.value,
            stage: updatedDeal.stage,
          }),
        },
      )

      if (!res.ok) {
        const errorData = await res.json()
        console.error('PUT /deals failed:', errorData)
        return
      }

      const savedDeal: Deal = await res.json()

      setDeals((prev) =>
        prev.map((deal) =>
          deal.id === savedDeal.id ? savedDeal : deal,
        ),
      )

      await refreshDashboard()
    } catch (error) {
      console.error('Request failed:', error)
    }
  }

  async function handleDeleteDeal(id: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this deal?',
    )

    if (!confirmed) return

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/deals/${id}`,
        {
          method: 'DELETE',
        },
      )

      if (!res.ok) {
        const errorData = await res.json()
        console.error('DELETE /deals failed:', errorData)
        return
      }

      setDeals((prev) =>
        prev.filter((deal) => deal.id !== id),
      )

      await refreshDashboard()
    } catch (error) {
      console.error('Request failed:', error)
    }
  }

  // =========================
  // DASHBOARD REFRESH
  // =========================

  async function refreshDashboard() {
    try {
      const res = await fetch('http://127.0.0.1:8000/dashboard')

      if (!res.ok) {
        console.error('GET /dashboard failed:', res.status)
        return
      }

      const data: DashboardData = await res.json()

      setDashboardData(data)
    } catch (error) {
      console.error('Dashboard refresh failed:', error)
    }
  }

  // =========================
  // PAGE
  // =========================

  const currentPage =
    pageMeta[activeNavItem] ?? pageMeta.dashboard

  function renderPage() {
    switch (activeNavItem) {
      case 'contacts':
        return (
          <ContactsPage
            contacts={contacts}
            onAddContact={handleAddContact}
            onUpdateContact={handleUpdateContact}
            onDeleteContact={handleDeleteContact}
          />
        )

      case 'deals':
        return (
          <DealsPage
            deals={deals}
            contacts={contacts}
            onAddDeal={handleAddDeal}
            onUpdateDeal={handleUpdateDeal}
            onDeleteDeal={handleDeleteDeal}
          />
        )

      case 'tasks':
        return <TasksPage />

      case 'dashboard':
        return (
          <DashboardPage
            stats={dashboardStats}
            activities={recentActivities}
          />
        )

      default:
        return (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-900">
              Coming soon
            </p>

            <p className="mt-2 text-sm text-slate-500">
              This section is under development.
            </p>
          </div>
        )
    }
  }

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-medium text-slate-700">
            Loading FairCRM...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Connecting to the backend
          </p>
        </div>
      </div>
    )
  }

  // =========================
  // CONNECTION ERROR
  // =========================

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            !
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Unable to connect
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            FairCRM could not connect to the backend.
            Make sure the FastAPI server is running.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  // =========================
  // APP
  // =========================

  return (
    <DashboardLayout
      navItems={navItems}
      activeNavItem={activeNavItem}
      onNavItemClick={setActiveNavItem}
      pageTitle={currentPage.title}
      pageSubtitle={currentPage.subtitle}
    >
      {renderPage()}
    </DashboardLayout>
  )
}

export default App