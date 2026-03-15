import type {
  Todo,
  User,
  CreateTodoPayload,
  UpdateTodoPayload,
} from "@/types/todo"

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://jsonplaceholder.typicode.com"

// small helper to call the API
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed with status ${response.status}`)
  }

  return response.json()
}

/* -----------------------
   Todos
----------------------- */

export async function getTodos(): Promise<Todo[]> {
  return request<Todo[]>("/todos")
}

export async function getTodo(id: number): Promise<Todo> {
  return request<Todo>(`/todos/${id}`)
}

export async function getTodosByUser(userId: number): Promise<Todo[]> {
  return request<Todo[]>(`/todos?userId=${userId}`)
}

/* -----------------------
   Users
----------------------- */

export async function getUsers(): Promise<User[]> {
  return request<User[]>("/users")
}

/* -----------------------
   Mutations
----------------------- */

export async function createTodo(data: CreateTodoPayload): Promise<Todo> {
  return request<Todo>("/todos", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateTodo(data: UpdateTodoPayload): Promise<Todo> {
  const id = data?.id
  if (id == null || typeof id !== "number") {
    throw new Error("updateTodo: id is required and must be a number")
  }
  // Send a plain object with only the fields json-server expects (lowercase "id").
  // PATCH avoids some json-server PUT issues when the resource might not exist yet.
  const body = {
    id,
    title: data.title ?? "",
    userId: data.userId ?? 0,
    completed: data.completed === true,
  }
  return request<Todo>(`/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export async function deleteTodo(id: number): Promise<void> {
  await request(`/todos/${id}`, {
    method: "DELETE",
  })
}