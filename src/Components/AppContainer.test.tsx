import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppContainer } from "./AppContainer";

// Mock CardList so we don't need react-spring / use-gesture in jsdom
vi.mock("./CardList", () => ({
  CardList: () => <div data-testid="card-list" />,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function setup() {
  const user = userEvent.setup();
  render(<AppContainer />);
  return { user };
}

async function goToOptions(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByText("Options"));
}

async function goToGame(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByText("Start"));
}

// ── Start screen ──────────────────────────────────────────────────────────────

describe("Start screen", () => {
  it("renders Start and Options on load", () => {
    setup();
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("Options")).toBeInTheDocument();
  });

  it("does not show the game or options panel initially", () => {
    setup();
    expect(screen.queryByTestId("card-list")).not.toBeInTheDocument();
    expect(screen.queryByText("Players:")).not.toBeInTheDocument();
  });
});

// ── Navigation ────────────────────────────────────────────────────────────────

describe("Navigation", () => {
  it("Start → game screen shows CardList", async () => {
    const { user } = setup();
    await goToGame(user);
    expect(screen.getByTestId("card-list")).toBeInTheDocument();
  });

  it("Options → options screen shows player selector and checkboxes", async () => {
    const { user } = setup();
    await goToOptions(user);
    expect(screen.getByText("Players:")).toBeInTheDocument();
    expect(screen.getByLabelText("Titans")).toBeInTheDocument();
    expect(screen.getByLabelText("Hades")).toBeInTheDocument();
    expect(screen.getByLabelText("Favors")).toBeInTheDocument();
    expect(screen.getByLabelText("Hecate")).toBeInTheDocument();
  });

  it("back from options returns to start screen", async () => {
    const { user } = setup();
    await goToOptions(user);
    await user.click(screen.getByText("back"));
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.queryByText("Players:")).not.toBeInTheDocument();
  });
});

// ── Options: player count ─────────────────────────────────────────────────────

describe("Options — player count", () => {
  it("defaults to 5 players", async () => {
    const { user } = setup();
    await goToOptions(user);
    expect(screen.getByText("5").closest(".player-item")).toHaveClass("selected");
  });

  it("selecting a player count highlights it", async () => {
    const { user } = setup();
    await goToOptions(user);
    await user.click(screen.getByText("4"));
    expect(screen.getByText("4").closest(".player-item")).toHaveClass("selected");
    expect(screen.getByText("5").closest(".player-item")).not.toHaveClass("selected");
  });

  it("6-player option is disabled without Titans", async () => {
    const { user } = setup();
    await goToOptions(user);
    expect(screen.getByText("6").closest(".player-item")).toHaveClass("disabled");
  });

  it("6-player option is enabled with Titans", async () => {
    const { user } = setup();
    await goToOptions(user);
    await user.click(screen.getByLabelText("Titans"));
    expect(screen.getByText("6").closest(".player-item")).not.toHaveClass("disabled");
  });
});

// ── Options: checkboxes ───────────────────────────────────────────────────────

describe("Options — checkboxes", () => {
  it("all checkboxes start unchecked", async () => {
    const { user } = setup();
    await goToOptions(user);
    expect(screen.getByLabelText("Titans")).not.toBeChecked();
    expect(screen.getByLabelText("Hades")).not.toBeChecked();
    expect(screen.getByLabelText("Favors")).not.toBeChecked();
    expect(screen.getByLabelText("Hecate")).not.toBeChecked();
  });

  it("toggling each checkbox checks/unchecks it", async () => {
    const { user } = setup();
    await goToOptions(user);

    for (const label of ["Titans", "Hades", "Favors"] as const) {
      await user.click(screen.getByLabelText(label));
      expect(screen.getByLabelText(label)).toBeChecked();
      await user.click(screen.getByLabelText(label));
      expect(screen.getByLabelText(label)).not.toBeChecked();
    }
  });

  it("Hecate is disabled when Favors is off", async () => {
    const { user } = setup();
    await goToOptions(user);
    expect(screen.getByLabelText("Hecate")).toBeDisabled();
  });

  it("Hecate becomes enabled when Favors is on", async () => {
    const { user } = setup();
    await goToOptions(user);
    await user.click(screen.getByLabelText("Favors"));
    expect(screen.getByLabelText("Hecate")).not.toBeDisabled();
  });

  it("disabling Favors disables Hecate again", async () => {
    const { user } = setup();
    await goToOptions(user);
    await user.click(screen.getByLabelText("Favors"));
    await user.click(screen.getByLabelText("Favors"));
    expect(screen.getByLabelText("Hecate")).toBeDisabled();
  });
});
