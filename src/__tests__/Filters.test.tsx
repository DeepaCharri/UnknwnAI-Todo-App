import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Filters } from "@/components/Filters";

const mockUsers = [
  { id: 1, name: "Alice", username: "alice", email: "alice@example.com" },
  { id: 2, name: "Bob", username: "bob", email: "bob@example.com" },
];

describe("Filters", () => {
  it("renders search input and filter dropdowns", () => {
    render(
      <Filters
        search=""
        onSearchChange={() => {}}
        status="all"
        onStatusChange={() => {}}
        userId=""
        onUserIdChange={() => {}}
        users={mockUsers}
      />
    );
    expect(screen.getByPlaceholderText(/search by title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by user/i)).toBeInTheDocument();
  });

  it("calls onSearchChange when typing in search", async () => {
    const onSearchChange = jest.fn();
    render(
      <Filters
        search=""
        onSearchChange={onSearchChange}
        status="all"
        onStatusChange={() => {}}
        userId=""
        onUserIdChange={() => {}}
        users={mockUsers}
      />
    );
    const input = screen.getByPlaceholderText(/search by title/i);
    await userEvent.type(input, "test");
    expect(onSearchChange).toHaveBeenCalled();
  });

  it("shows user options in dropdown", () => {
    render(
      <Filters
        search=""
        onSearchChange={() => {}}
        status="all"
        onStatusChange={() => {}}
        userId=""
        onUserIdChange={() => {}}
        users={mockUsers}
      />
    );
    expect(screen.getByRole("option", { name: "Alice" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Bob" })).toBeInTheDocument();
  });
});
