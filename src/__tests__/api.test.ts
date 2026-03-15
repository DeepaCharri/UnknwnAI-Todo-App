/**
 * API client tests with mocked fetch so we don't require network or global fetch in Jest.
 */
const mockTodos = [
  { id: 1, title: "Test todo", userId: 1, completed: false },
];
const mockUsers = [
  { id: 1, name: "Alice", username: "alice", email: "alice@example.com" },
];

beforeAll(() => {
  global.fetch = jest.fn((url: string) => {
    if (url.includes("/todos")) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(mockTodos) } as Response);
    }
    if (url.includes("/users")) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(mockUsers) } as Response);
    }
    return Promise.resolve({ ok: false } as Response);
  }) as jest.Mock;
});

afterAll(() => {
  (global.fetch as jest.Mock).mockRestore();
});

describe("API client", () => {
  it("getTodos returns array of todos with required fields", async () => {
    const { getTodos } = await import("@/lib/api");
    const todos = await getTodos();
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBe(1);
    expect(todos[0]).toHaveProperty("id");
    expect(todos[0]).toHaveProperty("title");
    expect(todos[0]).toHaveProperty("userId");
    expect(todos[0]).toHaveProperty("completed");
  });

  it("getUsers returns array of users with required fields", async () => {
    const { getUsers } = await import("@/lib/api");
    const users = await getUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(1);
    expect(users[0]).toHaveProperty("id");
    expect(users[0]).toHaveProperty("name");
    expect(users[0]).toHaveProperty("email");
  });
});
