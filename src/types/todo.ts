/** JSONPlaceholder Todo shape */
export interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

/** JSONPlaceholder User shape */
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

/** Payload for creating a todo */
export interface CreateTodoPayload {
  title: string;
  userId: number;
  completed?: boolean;
}

/** Payload for updating a todo (all fields for PUT) */
export interface UpdateTodoPayload {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}
