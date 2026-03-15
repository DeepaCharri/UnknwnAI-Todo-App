"use client";

import { useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTodoRow } from "./SortableTodoRow";
import type { Todo, User } from "@/types/todo";
import type { StatusFilter } from "./Filters";

const animation = { duration: 0.25, ease: "easeOut" as const };

const listMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

interface TodoListProps {
  todos: Todo[];
  users: User[];
  search: string;
  status: StatusFilter;
  userId: number | "";
  page: number;
  pageSize: number;
  onToggle: (todo: Todo) => void;
  onUpdateTitle: (id: number, title: string) => void;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
  onReorder: (newTodos: Todo[]) => void;
  togglingId: number | null;
  updatingId: number | null;
}

export function TodoList({
  todos,
  users,
  search,
  status,
  userId,
  page,
  pageSize,
  onToggle,
  onUpdateTitle,
  onDelete,
  onPageChange,
  onReorder,
  togglingId,
  updatingId,
}: TodoListProps) {

  // quick lookup for users
  const usersById = useMemo(() => {
    return new Map(users.map((u) => [u.id, u]));
  }, [users]);

  // drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // apply filters
  const visibleTodos = useMemo(() => {
    let result = todos;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }

    if (status === "completed") {
      result = result.filter((t) => t.completed);
    }

    if (status === "pending") {
      result = result.filter((t) => !t.completed);
    }

    if (userId !== "") {
      result = result.filter((t) => t.userId === userId);
    }

    return result;
  }, [todos, search, status, userId]);

  // paginate results
  const pageTodos = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return visibleTodos.slice(startIndex, startIndex + pageSize);
  }, [visibleTodos, page, pageSize]);

  // reorder after drag
  const onDragFinish = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const from = pageTodos.findIndex((t) => t.id === active.id);
      const to = pageTodos.findIndex((t) => t.id === over.id);

      if (from === -1 || to === -1) return;

      const reordered = [...pageTodos];
      const [moved] = reordered.splice(from, 1);
      reordered.splice(to, 0, moved);

      // update full list order
      const pageIndices = pageTodos.map((t) =>
        todos.findIndex((x) => x.id === t.id)
      );

      const updatedTodos = [...todos];

      reordered.forEach((todo, index) => {
        updatedTodos[pageIndices[index]] = todo;
      });

      onReorder(updatedTodos);
    },
    [pageTodos, todos, onReorder]
  );

  const totalPages = Math.max(1, Math.ceil(visibleTodos.length / pageSize));

  if (visibleTodos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
        <p className="text-[var(--muted-foreground)]">
          {todos.length === 0
            ? "No todos yet. Add one above!"
            : "No todos match your filters."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragFinish}
      >
        <SortableContext
          items={pageTodos.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <p className="mb-2 text-xs text-[var(--muted-foreground)]">
            Drag the grip to reorder tasks
          </p>

          <AnimatePresence mode="wait">
            <motion.ul
              key={page}
              className="space-y-2"
              role="list"
              variants={listMotion}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={animation}
            >
              {pageTodos.map((todo) => (
                <SortableTodoRow
                  key={todo.id}
                  todo={todo}
                  user={usersById.get(todo.userId)}
                  onToggle={onToggle}
                  onUpdateTitle={onUpdateTitle}
                  onDelete={onDelete}
                  isToggling={togglingId === todo.id}
                  isUpdating={updatingId === todo.id}
                />
              ))}
            </motion.ul>
          </AnimatePresence>
        </SortableContext>
      </DndContext>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        Previous
      </button>

      <span className="text-sm text-[var(--muted-foreground)]">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}