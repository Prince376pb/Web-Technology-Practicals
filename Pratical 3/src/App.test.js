import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

describe("Labour Connect Web Application", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders navbar brand and navigation links", () => {
    render(<App />);
    const brandElements = screen.getAllByText(/Labour/i);
    expect(brandElements.length).toBeGreaterThan(0);

    const findWorkersLinks = screen.getAllByText(/Find Workers/i);
    expect(findWorkersLinks.length).toBeGreaterThan(0);

    const registerLinks = screen.getAllByText(/Register/i);
    expect(registerLinks.length).toBeGreaterThan(0);
  });

  test("renders hero section with action buttons", () => {
    render(<App />);
    const heroTitle = screen.getByRole("heading", {
      name: /Connect With Trusted Local/i
    });
    expect(heroTitle).toBeInTheDocument();

    const heroLinks = screen.getAllByRole("link", {
      name: /Find Workers/i
    });
    expect(heroLinks.length).toBeGreaterThan(0);
  });

  test("renders dynamic statistics cards", () => {
    render(<App />);
    expect(screen.getAllByText(/Registered Workers/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Available Trade Skills/i)).toBeInTheDocument();
    expect(screen.getByText(/Average Experience/i)).toBeInTheDocument();
    expect(screen.getByText(/Locations Covered/i)).toBeInTheDocument();
  });

  test("renders registration form fields and submit button", () => {
    render(<App />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Trade \/ Skill Selection/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Experience in Years/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location \/ Area \/ City/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Register Worker Profile/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reset Form/i })).toBeInTheDocument();
  });

  test("displays field validation errors on empty form submit", () => {
    render(<App />);
    const submitBtn = screen.getByRole("button", { name: /Register Worker Profile/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Full name is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/Email address is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/Phone number is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/Skill selection is mandatory\./i)).toBeInTheDocument();
    expect(screen.getByText(/Experience in years is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/Location is required\./i)).toBeInTheDocument();
  });

  test("validates specific format errors (short name, invalid email, short phone, invalid exp)", () => {
    render(<App />);
    const nameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    const skillSelect = screen.getByLabelText(/Trade \/ Skill Selection/i);
    const expInput = screen.getByLabelText(/Experience in Years/i);
    const locInput = screen.getByLabelText(/Location \/ Area \/ City/i);
    const submitBtn = screen.getByRole("button", { name: /Register Worker Profile/i });

    fireEvent.change(nameInput, { target: { value: "Al" } });
    fireEvent.change(emailInput, { target: { value: "not-an-email" } });
    fireEvent.change(phoneInput, { target: { value: "12345" } });
    fireEvent.change(skillSelect, { target: { value: "Plumber" } });
    fireEvent.change(expInput, { target: { value: "99" } });
    fireEvent.change(locInput, { target: { value: "M" } });

    fireEvent.click(submitBtn);

    expect(screen.getByText(/Name must contain at least 3 characters\./i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone number must contain exactly 10 digits\./i)).toBeInTheDocument();
    expect(screen.getByText(/Experience must be a number between 0 and 50\./i)).toBeInTheDocument();
    expect(screen.getByText(/Location must contain at least 2 characters\./i)).toBeInTheDocument();
  });

  test("clears form when clicking reset button", () => {
    render(<App />);
    const nameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: "Test Worker" } });
    expect(nameInput.value).toBe("Test Worker");

    const resetBtn = screen.getByRole("button", { name: /Reset Form/i });
    fireEvent.click(resetBtn);

    expect(nameInput.value).toBe("");
  });

  test("registers a new worker successfully", async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "Vikram Chauhan" }
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "vikram@example.com" }
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "9823456789" }
    });
    fireEvent.change(screen.getByLabelText(/Trade \/ Skill Selection/i), {
      target: { value: "Electrician" }
    });
    fireEvent.change(screen.getByLabelText(/Experience in Years/i), {
      target: { value: "6" }
    });
    fireEvent.change(screen.getByLabelText(/Location \/ Area \/ City/i), {
      target: { value: "Jaipur - Malviya Nagar" }
    });

    const submitBtn = screen.getByRole("button", { name: /Register Worker Profile/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Worker profile for "Vikram Chauhan" was registered successfully!/i)
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Vikram Chauhan")).toBeInTheDocument();
  });

  test("filters workers by search query and shows empty state when no match", () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Search by worker name, skill, or location/i);

    fireEvent.change(searchInput, { target: { value: "NonExistentLocationXYZ" } });

    expect(screen.getByText(/No Workers Match Your Search Criteria/i)).toBeInTheDocument();

    const resetFiltersBtn = screen.getByRole("button", { name: /Reset All Filters/i });
    fireEvent.click(resetFiltersBtn);

    expect(screen.queryByText(/No Workers Match Your Search Criteria/i)).not.toBeInTheDocument();
  });

  test("opens delete confirmation modal and can cancel or confirm deletion", async () => {
    render(<App />);

    // Seed worker Ramesh Sharma should be present
    expect(screen.getByText("Ramesh Sharma")).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole("button", { name: /Delete Ramesh Sharma/i });
    fireEvent.click(deleteButtons[0]);

    // Modal should be open
    expect(screen.getByText(/Confirm Worker Removal/i)).toBeInTheDocument();

    // Cancel deletion
    const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(screen.queryByText(/Confirm Worker Removal/i)).not.toBeInTheDocument();
    expect(screen.getByText("Ramesh Sharma")).toBeInTheDocument();

    // Click delete again and confirm
    fireEvent.click(deleteButtons[0]);
    const confirmDeleteBtn = screen.getByRole("button", { name: /Yes, Delete Profile/i });
    fireEvent.click(confirmDeleteBtn);

    // Profile should now be removed from the list
    await waitFor(() => {
      expect(screen.queryByText("Ramesh Sharma")).not.toBeInTheDocument();
    });
  });
});
