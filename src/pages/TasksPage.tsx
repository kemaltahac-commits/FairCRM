import { useEffect, useState } from 'react'

interface Task {
  id: string
  title: string
  status: 'pending' | 'completed'
  dueDate: string
}

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  // =========================
  // LOAD TASKS
  // =========================

  async function loadTasks() {
    try {
      setIsLoading(true)
      setLoadError(false)

      const response = await fetch(
        'http://127.0.0.1:8000/tasks'
      )

      if (!response.ok) {
        throw new Error('Failed to load tasks')
      }

      const data: Task[] = await response.json()

      setTasks(data)
    } catch (error) {
      console.error('Failed to load tasks:', error)
      setLoadError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  // =========================
  // MODAL
  // =========================

  function openModal() {
    setTitle('')
    setDueDate('')
    setEditingTaskId(null)
    setIsModalOpen(true)
  }

  function openEditModal(task: Task) {
    setTitle(task.title)
    setDueDate(task.dueDate)
    setEditingTaskId(task.id)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingTaskId(null)
    setTitle('')
    setDueDate('')
  }

  // =========================
  // CREATE
  // =========================

  async function handleAddTask() {
    if (!title.trim()) return

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/tasks',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title.trim(),
            status: 'pending',
            dueDate,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Task could not be created')
      }

      const newTask: Task = await response.json()

      setTasks((prev) => [...prev, newTask])

      closeModal()
    } catch (error) {
      console.error('Task creation failed:', error)
    }
  }

  // =========================
  // UPDATE
  // =========================

  async function handleUpdateTask() {
    if (!editingTaskId || !title.trim()) return

    const currentTask = tasks.find(
      (task) => task.id === editingTaskId
    )

    if (!currentTask) return

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/${editingTaskId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title.trim(),
            status: currentTask.status,
            dueDate,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Task could not be updated')
      }

      const updatedTask: Task = await response.json()

      setTasks((prev) =>
        prev.map((task) =>
          task.id === updatedTask.id
            ? updatedTask
            : task
        )
      )

      closeModal()
    } catch (error) {
      console.error('Task update failed:', error)
    }
  }

  // =========================
  // DELETE
  // =========================

  async function handleDeleteTask(taskId: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    )

    if (!confirmed) return

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/${taskId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Task could not be deleted')
      }

      setTasks((prev) =>
        prev.filter((task) => task.id !== taskId)
      )
    } catch (error) {
      console.error('Task deletion failed:', error)
    }
  }

  // =========================
  // TOGGLE STATUS
  // =========================

  async function handleToggleTask(task: Task) {
    const newStatus =
      task.status === 'pending'
        ? 'completed'
        : 'pending'

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/${task.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: task.title,
            status: newStatus,
            dueDate: task.dueDate,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(
          'Task status could not be updated'
        )
      }

      const updatedTask: Task = await response.json()

      setTasks((prev) =>
        prev.map((item) =>
          item.id === updatedTask.id
            ? updatedTask
            : item
        )
      )
    } catch (error) {
      console.error(
        'Task status update failed:',
        error
      )
    }
  }

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-medium text-slate-700">
            Loading tasks...
          </p>
        </div>
      </div>
    )
  }

  // =========================
  // ERROR
  // =========================

  if (loadError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-lg font-semibold text-red-600">
            !
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Unable to load tasks
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            We couldn't connect to the FairCRM backend.
          </p>

          <button
            type="button"
            onClick={loadTasks}
            className="mt-6 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Tasks
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and track your tasks.
          </p>
        </div>

        <button
          type="button"
          onClick={openModal}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          + Add Task
        </button>
      </div>

      {/* TASK LIST */}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

        {tasks.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-medium text-slate-700">
              No tasks yet.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Create your first task to get started.
            </p>

            <button
              type="button"
              onClick={openModal}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Add your first task
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">

            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >

                {/* TASK INFO */}

                <div>
                  <p
                    className={`font-medium ${
                      task.status === 'completed'
                        ? 'text-slate-400 line-through'
                        : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {task.dueDate
                      ? `Due: ${task.dueDate}`
                      : 'No due date'}
                  </p>
                </div>

                {/* ACTIONS */}

                <div className="flex flex-wrap items-center gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      handleToggleTask(task)
                    }
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      task.status === 'pending'
                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {task.status === 'pending'
                      ? 'Pending'
                      : 'Completed'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openEditModal(task)
                    }
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteTask(task.id)
                    }
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* MODAL */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingTaskId
                  ? 'Edit Task'
                  : 'Add Task'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingTaskId
                  ? 'Update your task.'
                  : 'Create a new task.'}
              </p>
            </div>

            <div className="space-y-4">

              {/* TITLE */}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Task title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="e.g. Follow up with client"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* DATE */}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Due date
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

            </div>

            {/* MODAL ACTIONS */}

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  editingTaskId
                    ? handleUpdateTask
                    : handleAddTask
                }
                disabled={!title.trim()}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editingTaskId
                  ? 'Update Task'
                  : 'Save Task'}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}