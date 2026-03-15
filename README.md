# Todo

This project is a small Todo/Task management application built as part of a frontend coding assignment. The goal was to build a single-page app that interacts with a public REST API and demonstrates basic CRUD operations using a modern React stack.

The app uses the **JSONPlaceholder API** for data and focuses on clean UI, simple interactions, and good code structure.

---

# Tech Stack

I built the project using the following tools:

* **Next.js** (App Router)
* **TypeScript**
* **React** with functional components and hooks
* **Tailwind CSS** for styling
* **TanStack React Query** for handling API requests and caching
* **Framer Motion** for simple list animations
* **react-hot-toast** for notifications

---

# Features

## Display Todos

The application fetches todos from the JSONPlaceholder API and displays them in a list.
Each todo shows:

* title
* completion status
* user information (name and email)

To keep the list manageable, pagination is used (20 todos per page).

While data is loading, skeleton placeholders are displayed. If something goes wrong during the request, an error message is shown with a retry option.

---

## Create Todo

Users can add a new todo using a simple form.

The form includes:

* title input
* user selection dropdown

Basic validation is implemented to make sure the title is not empty and a user is selected.

After creating a todo:

* a toast notification appears
* the form resets
* the todo list updates automatically using React Query cache invalidation

---

## Filtering and Search

The list supports a few filters to make it easier to navigate the todos:

* search by title
* filter by completion status (all / completed / pending)
* filter by user

User information is fetched from the `/users` endpoint.

Completed tasks are visually marked with a strike-through and a status badge.

---

## Update Todo

There are two ways to update a todo:

**Toggle completion**

Clicking the checkbox marks the todo as completed or pending.

**Inline title editing**

Clicking the title allows it to be edited directly.
Pressing Enter or clicking outside the input saves the change.

Updates are reflected immediately in the UI.

---

## Delete Todo

Each todo item includes a delete button.

Before deleting, a confirmation dialog appears.
If confirmed, the item is removed from the list and the API request is triggered.

Errors are displayed using toast notifications.

---

# Additional Improvements

While the core CRUD functionality was the main requirement, a few additional features were added.

### Responsive Layout

The UI was built with a mobile-first approach so it works on smaller screens as well.

### Dark Mode

A theme toggle is available in the header.
The selected theme is saved in `localStorage`.

### Performance

Some minor optimizations were added:

* `React.memo` used for TodoItem
* React Query caching
* cache invalidation after mutations

### UI Enhancements

* toast notifications for actions
* skeleton loading states
* empty state message when filters return no results
* simple progress indicator showing completed tasks
* small animations when items appear or are removed

Drag-and-drop reordering was also added using `@dnd-kit`.

---

# Setup

### Install dependencies

```
npm install
```

### Environment setup

Create a `.env.local` file in the root of the project:

```
NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
```

If this variable is not provided, the default JSONPlaceholder API URL will still work.

---

### Start the development server

```
npm run dev
```

Open the app in the browser:

```
http://localhost:3000
```

---

### Build for production

```
npm run build
npm start
```

---

# Project Structure

```
src
 ├ app
 │  ├ layout.tsx
 │  ├ page.tsx
 │  ├ Providers.tsx
 │  └ globals.css
 │
 ├ components
 │  ├ TodoForm.tsx
 │  ├ Filters.tsx
 │  ├ TodoList.tsx
 │  ├ TodoItem.tsx
 │  ├ ConfirmDialog.tsx
 │  └ TodoListSkeleton.tsx
 │
 ├ lib
 │  ├ api.ts
 │  └ queryClient.ts
 │
 ├ types
 │  └ todo.ts
 │
 └ contexts
    └ ThemeContext.tsx
```

---

# API

The project uses the JSONPlaceholder API.

Base URL

```
https://jsonplaceholder.typicode.com
```

Endpoints used in the app:

```
GET /todos
GET /users
POST /todos
PUT /todos/:id
DELETE /todos/:id
```

Since JSONPlaceholder is a mock API, changes made through POST, PUT, or DELETE are not actually persisted. The UI stays in sync by updating the React Query cache.

---

# Limitations

Because the API is mocked:

* newly created todos disappear after a page refresh
* updates are not permanently stored

This project is also purely frontend and does not include authentication.

---

# Scripts

Start development server

```
npm run dev
```

Build production version

```
npm run build
```

Run production server

```
npm start
```

Run linter

```
npm run lint
```

Run tests

```
npm test
```