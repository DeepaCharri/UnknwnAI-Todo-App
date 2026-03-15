"use client";

import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Todo, User } from "@/types/todo";

interface TodoItemProps {
  todo: Todo
  user?: User
  onToggle: (todo: Todo) => void
  onUpdateTitle: (id: number, title: string) => void
  onDelete: (id: number) => void
  isToggling?: boolean
  isUpdating?: boolean
  asDiv?: boolean
}

function TodoItemComponent({
  todo,
  user,
  onToggle,
  onUpdateTitle,
  onDelete,
  isToggling = false,
  isUpdating = false,
  asDiv = false,
}: TodoItemProps) {

  const Wrapper = asDiv ? motion.div : motion.li

  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.title)

  // keep input value in sync if the title changes externally
  useEffect(() => {
    if (!editing) {
      setEditValue(todo.title)
    }
  }, [todo.title, editing])

  const handleBlur = () => {
    setEditing(false)

    const newTitle = editValue.trim()

    if (newTitle && newTitle !== todo.title) {
      onUpdateTitle(todo.id, newTitle)
    } else {
      setEditValue(todo.title)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur()
    }

    if (e.key === "Escape") {
      setEditValue(todo.title)
      setEditing(false)
      e.currentTarget.blur()
    }
  }

  return (
    <Wrapper
      layout={!asDiv}
      initial={!asDiv ? { opacity: 0, y: 8 } : undefined}
      animate={!asDiv ? { opacity: 1, y: 0 } : undefined}
      exit={!asDiv ? { opacity: 0, x: -20 } : undefined}
      className="flex flex-wrap items-center gap-2 p-1 sm:gap-4 sm:p-0"
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
        disabled={isToggling}
        className="h-4 w-4 rounded border-zinc-300 text-foreground focus:ring-2 focus:ring-foreground/20"
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      />

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={isUpdating}
            autoFocus
            aria-label="Edit todo title"
            className="w-full rounded border border-border bg-background px-2 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={`block w-full rounded text-left text-sm text-foreground hover:underline focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:ring-offset-2 ${
              todo.completed ? "line-through text-zinc-500" : ""
            }`}
          >
            {todo.title}
          </button>
        )}

        {user && (
          <p
            className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400"
            title={user.email}
          >
            {user.name} ({user.email})
          </p>
        )}
      </div>

      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          todo.completed
            ? "bg-green-100 text-green-1500 dark:bg-green-1000/40 dark:text-green-500"
            : "bg-amber-100 text-amber-1500 dark:bg-amber-1000/40 dark:text-amber-500"
        }`}
      >
        {todo.completed ? "Completed" : "Pending"}
      </span>

      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        className="rounded p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
        aria-label={`Delete todo: ${todo.title}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>
    </Wrapper>
  )
}

export const TodoItem = memo(TodoItemComponent)