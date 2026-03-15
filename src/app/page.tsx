"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTheme } from "@/contexts/ThemeContext";
import type { Todo } from "@/types/todo";
import {
  getTodos,
  getUsers,
  createTodo,
  updateTodo,
  deleteTodo,
} from "@/lib/api";
import { TodoForm } from "@/components/TodoForm";
import { Filters, type StatusFilter } from "@/components/Filters";
import { TodoList } from "@/components/TodoList";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { TodoListSkeleton } from "@/components/TodoListSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const PAGE_SIZE = 20;

export default function Home() {
  const queryClient = useQueryClient();
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [userId, setUserId] = useState<number | "">("");
  const [page, setPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);


  //set search and reset page
  const setSearchAndResetPage = (value: string) => {
    setSearch(value)
    setPage(1)
  }
  //set status and reset page
  const setStatusAndResetPage = (v: StatusFilter) => {
    setStatus(v);
    setPage(1);
  };

  //set user id and reset page
  const setUserIdAndResetPage = (v: number | "") => {
    setUserId(v);
    setPage(1);
  };
  
  //fetch todos using useQuery
  const {
    data: todos = [],
    isLoading: todosLoading,
    isError: todosError,
    refetch: refetchTodos,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });
  //fetch users using useQuery
  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  //create todo using useMutation
  const createMutation = useMutation({
    mutationFn: ({ title, uid }: { title: string; uid: number }) =>
      createTodo({ title, userId: uid }),
    onSuccess: (newTodo) => {
      // JSONPlaceholder doesn't persist: add new todo to cache so it stays in the list.
      // Normalize so it always has id, title, userId, completed (required for later updates).
      const todo: Todo = {
        id: newTodo.id,
        title: newTodo.title,
        userId: newTodo.userId,
        completed: newTodo.completed === true,
      };
      queryClient.setQueryData<Todo[]>(["todos"], (old = []) => [...old, todo]);
      toast.success("Todo added.");
    },
    onError: () => {
      toast.error("Failed to add todo.");
    },
  });

  //update todo using useMutation
  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: (updatedTodo) => {
      // JSONPlaceholder doesn't persist: update cache so UI shows the change.
      // Normalize response so we always have id and can find the item to replace.
      const id = updatedTodo?.id;
      if (id == null || typeof id !== "number") return;
      const todo: Todo = {
        id,
        title: updatedTodo.title ?? "",
        userId: updatedTodo.userId ?? 0,
        completed: updatedTodo.completed === true,
      };
      queryClient.setQueryData<Todo[]>(["todos"], (old = []) =>
        old.map((t) => (t.id === id ? todo : t))
      );
      toast.success("Todo updated.");
    },
    onError: () => {
      toast.error("Failed to update todo.");
    },
  });

  //delete todo using useMutation
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: (_, deletedId) => {
      // JSONPlaceholder doesn't persist remove from cache so it disappears from list
      queryClient.setQueryData<Todo[]>(["todos"], (old = []) =>
        old.filter((t) => t.id !== deletedId)
      );
      setDeleteConfirmId(null);
      toast.success("Todo deleted.");
    },
    onError: () => {
      toast.error("Failed to delete todo.");
    },
  });

  //add todo
  const addTodo = async (title: string, uid: number) => {
      await createMutation.mutateAsync({ title, uid });
    }

  //handle toggle
  const handleToggle = useCallback(
    (todo: Todo) => {
      setTogglingId(todo.id);
      updateMutation.mutate(
        {
          id: todo.id,
          title: todo.title,
          userId: todo.userId,
          completed: !(todo.completed === true),
        },
        {
          onSettled: () => setTogglingId(null),
        }
      );
    },
    [updateMutation]
  );

  //handle update title
  const handleUpdateTitle = useCallback(
    (id: number, title: string) => {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;
      setUpdatingId(id);
      updateMutation.mutate(
        {
          id: todo.id,
          title,
          userId: todo.userId,
          completed: todo.completed === true,
        },
        {
          onSettled: () => setUpdatingId(null),
        }
      );
    },
    [todos, updateMutation]
  );
  //open delete confirm
  const openDeleteConfirm = (id: number) => setDeleteConfirmId(id);
  //handle delete confirm
  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirmId != null) deleteMutation.mutate(deleteConfirmId);
  }, [deleteConfirmId, deleteMutation]);
  //close delete cancel
  const closeDeleteCancel = () => setDeleteConfirmId(null);
  //handle reorder
  const handleReorder = useCallback(
    (newTodos: Todo[]) => {
      queryClient.setQueryData<Todo[]>(["todos"], newTodos);
      toast.success("Order updated.");
    },
    [queryClient]
  );

  const isLoading = todosLoading || usersLoading;
  const isError = todosError || usersError;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
            <h1 className="text-xl font-bold text-primary">Todo - Task Management App</h1>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-6">
          <section className="mb-6">
            <TodoForm
              users={users}
              onSubmit={addTodo}
            />
          </section>

          <section className="mb-4">
            <Filters
              search={search}
              onSearchChange={setSearchAndResetPage}
              status={status}
              onStatusChange={setStatusAndResetPage}
              userId={userId}
              onUserIdChange={setUserIdAndResetPage}
              users={users}
            />
          </section>

          {!isLoading && !isError && todos.length > 0 && (
            <div className="mb-4 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <span>
                {todos.filter((t) => t.completed).length} of {todos.length} completed
              </span>
              <div className="h-2 flex-1 max-w-[120px] rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${(todos.filter((t) => t.completed).length / todos.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {isLoading && <TodoListSkeleton />}
          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
              <p className="text-red-800 dark:text-red-200">
                Failed to load data. Please check your connection and try again.
              </p>
              <button
                type="button"
                onClick={() => refetchTodos()}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}
          {!isLoading && !isError && (
            <TodoList
              todos={todos}
              users={users}
              search={search}
              status={status}
              userId={userId}
              page={page}
              pageSize={PAGE_SIZE}
              onToggle={handleToggle}
              onUpdateTitle={handleUpdateTitle}
              onDelete={openDeleteConfirm}
              onPageChange={setPage}
              onReorder={handleReorder}
              togglingId={togglingId}
              updatingId={updatingId}
            />
          )}
        </main>
      </div>

      <ConfirmDialog
        open={deleteConfirmId != null}
        title="Delete todo?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteCancel}
        danger
      />
    </ErrorBoundary>
  );
}
