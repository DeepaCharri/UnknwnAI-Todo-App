"use client";

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TodoItem } from "./TodoItem"
import type { Todo, User } from "@/types/todo"

interface SortableTodoRowProps {
  todo: Todo
  user?: User
  onToggle: (todo: Todo) => void
  onUpdateTitle: (id: number, title: string) => void
  onDelete: (id: number) => void
  isToggling?: boolean
  isUpdating?: boolean
}

// small grip icon used as drag handle
function GripIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="4" cy="4" r="1.5" />
      <circle cx="12" cy="4" r="1.5" />
      <circle cx="4" cy="8" r="1.5" />
      <circle cx="12" cy="8" r="1.5" />
      <circle cx="4" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  )
}

export function SortableTodoRow({
  todo,
  user,
  onToggle,
  onUpdateTitle,
  onDelete,
  isToggling,
  isUpdating,
}: SortableTodoRowProps) {

  // dnd-kit hook to make the row draggable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1 rounded-lg border border-border bg-card sm:gap-2 ${
        isDragging
          ? "z-50 opacity-90 shadow-lg ring-2 ring-foreground/20"
          : ""
      }`}
    >
      {/* drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab p-2 text-[var(--muted-foreground)] hover:text-foreground active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:ring-inset rounded"
        aria-label={`Drag to reorder: ${todo.title}`}
      >
        <GripIcon />
      </button>

      {/* todo content */}
      <div className="min-w-0 flex-1 py-1 pr-2 sm:py-3 sm:pr-3">
        <TodoItem
          todo={todo}
          user={user}
          onToggle={onToggle}
          onUpdateTitle={onUpdateTitle}
          onDelete={onDelete}
          isToggling={isToggling}
          isUpdating={isUpdating}
          asDiv
        />
      </div>
    </li>
  )
}