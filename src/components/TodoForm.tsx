"use client";

import { useState, useEffect } from "react";
import type { User } from "@/types/todo";

interface TodoFormProps {
  users: User[]
  onSubmit: (title: string, userId: number) => Promise<void>
}

export function TodoForm({ users, onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState("")
  const [userId, setUserId] = useState<number>(users[0]?.id ?? 0)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // if users load after mount, set the first user as default
  useEffect(() => {
    if (users.length > 0 && (userId === 0 || !users.find((u) => u.id === userId))) {
      setUserId(users[0].id)
    }
  }, [users, userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError(null)

    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setError("Title is required.")
      return
    }

    const selectedUser = userId || users[0]?.id

    if (!selectedUser) {
      setError("Please select a user.")
      return
    }

    setSubmitting(true)

    try {
      await onSubmit(trimmedTitle, selectedUser)

      // reset form
      setTitle("")
      setUserId(users[0]?.id ?? 0)

    } catch {
      setError("Failed to create todo. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label htmlFor="todo-title" className="sr-only">
          Todo title
        </label>

        <input
          id="todo-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          disabled={submitting}
          aria-invalid={!!error}
          aria-describedby={error ? "form-error" : undefined}
          className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      <div className="w-full sm:w-44">
        <label htmlFor="todo-user" className="sr-only">
          Assign to user
        </label>

        <select
          id="todo-user"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          disabled={submitting}
          className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting || users.length === 0}
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        {submitting
          ? "Adding..."
          : users.length === 0
          ? "Loading users..."
          : "Add Todo"}
      </button>

      {error && (
        <p
          id="form-error"
          className="text-sm text-red-600 dark:text-red-400 sm:col-span-full"
        >
          {error}
        </p>
      )}
    </form>
  )
}