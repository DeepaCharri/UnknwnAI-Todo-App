"use client";

import type { User } from "@/types/todo"

export type StatusFilter = "all" | "completed" | "pending"

interface FiltersProps {
  search: string
  onSearchChange: (value: string) => void
  status: StatusFilter
  onStatusChange: (value: StatusFilter) => void
  userId: number | ""
  onUserIdChange: (value: number | "") => void
  users: User[]
}

export function Filters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  userId,
  onUserIdChange,
  users,
}: FiltersProps) {

  // update search text
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value)
  }

  // update status filter
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(e.target.value as StatusFilter)
  }

  // update selected user
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    onUserIdChange(value === "" ? "" : Number(value))
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">

      {/* search input */}
      <div className="min-w-[200px] flex-1 sm:max-w-xs">
        <label htmlFor="filter-search" className="sr-only">
          Search by title
        </label>

        <input
          id="filter-search"
          type="search"
          value={search}
          onChange={handleSearch}
          placeholder="Search by title…"
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-foreground/20"
          aria-label="Search todos by title"
        />
      </div>

      {/* status filter */}
      <div>
        <label htmlFor="filter-status" className="sr-only">
          Filter by status
        </label>

        <select
          id="filter-status"
          value={status}
          onChange={handleStatusChange}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          aria-label="Filter by completion status"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* user filter */}
      <div>
        <label htmlFor="filter-user" className="sr-only">
          Filter by user
        </label>

        <select
          id="filter-user"
          value={userId}
          onChange={handleUserChange}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          aria-label="Filter by user"
        >
          <option value="">All users</option>

          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}

        </select>
      </div>

    </div>
  )
}