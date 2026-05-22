import { describe, it, expect } from "vitest";
import { computeNewOrder } from "./shuffleLogic";
import type { ShuffleHistoryEntry } from "../Components/AppContainer";

// ── Helpers ───────────────────────────────────────────────────────────────────

const gods = [0, 1, 2, 3]; // standard 4-god set
const titans = [0, 1, 2, 3, 4]; // titans 5-god set

function history(...entries: Partial<ShuffleHistoryEntry>[]): ShuffleHistoryEntry[] {
  return entries.map((e, i) => ({
    cycle: i,
    order: gods,
    wasShuffled: true,
    ...e,
  }));
}

/** Assert that arr is a permutation of expected (same elements, any order). */
function isPermutationOf(arr: number[], expected: number[]) {
  expect(arr).toHaveLength(expected.length);
  expect([...arr].sort()).toEqual([...expected].sort());
}

// ── Standard gods (no Titans) ─────────────────────────────────────────────────

describe("Standard gods", () => {
  describe("5 players", () => {
    it("returns all 4 gods in some order", () => {
      const { order, wasShuffled } = computeNewOrder(
        gods,
        history({ order: [2, 0, 3, 1] }),
        false, 5, 4
      );
      isPermutationOf(order, gods);
      expect(wasShuffled).toBe(true);
    });

    it("produces different orderings over many runs (randomness check)", () => {
      const results = new Set(
        Array.from({ length: 30 }, () =>
          computeNewOrder(gods, history({ order: [0, 1, 2, 3] }), false, 5, 4).order.join(",")
        )
      );
      // With 24 possible permutations, 30 runs should yield >1 distinct result
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe("4 players", () => {
    it("last god of previous round goes first", () => {
      // Previous round ended with god 1 last → god 1 must go first
      const { order } = computeNewOrder(
        gods,
        history({ order: [2, 0, 3, 1] }),
        false, 4, 4
      );
      expect(order[0]).toBe(1);
      isPermutationOf(order, gods);
    });

    it("the remaining 3 gods follow in any order", () => {
      const { order } = computeNewOrder(
        gods,
        history({ order: [0, 3, 1, 2] }),
        false, 4, 4
      );
      expect(order[0]).toBe(2);
      expect(order.slice(1)).toEqual(expect.arrayContaining([0, 1, 3]));
    });
  });

  describe("3 players — alternating pattern", () => {
    it("when wasShuffled=true: last 2 go first, first 2 go last (no re-shuffle)", () => {
      const { order, wasShuffled } = computeNewOrder(
        gods,
        history({ order: [2, 0, 3, 1], wasShuffled: true }),
        false, 3, 4
      );
      // Last 2 of [2,0,3,1] are [3,1]; first 2 are [2,0]
      expect(order).toEqual([3, 1, 2, 0]);
      expect(wasShuffled).toBe(false);
    });

    it("when wasShuffled=false: reshuffles all gods", () => {
      const { order, wasShuffled } = computeNewOrder(
        gods,
        history({ order: [3, 1, 2, 0], wasShuffled: false }),
        false, 3, 4
      );
      isPermutationOf(order, gods);
      expect(wasShuffled).toBe(true);
    });

    it("two-round alternating cycle is self-consistent", () => {
      const round1 = computeNewOrder(
        gods,
        history({ order: [0, 1, 2, 3], wasShuffled: true }),
        false, 3, 4
      );
      expect(round1.wasShuffled).toBe(false);
      expect(round1.order).toEqual([2, 3, 0, 1]);

      const round2 = computeNewOrder(
        round1.order,
        [{ cycle: 1, order: round1.order, wasShuffled: false }],
        false, 3, 4
      );
      expect(round2.wasShuffled).toBe(true);
      isPermutationOf(round2.order, gods);
    });
  });

  describe("2 players", () => {
    it("behaves like 4-player rule: last god goes first", () => {
      const { order } = computeNewOrder(
        gods,
        history({ order: [1, 3, 0, 2] }),
        false, 2, 4
      );
      expect(order[0]).toBe(2);
      isPermutationOf(order, gods);
    });
  });
});

// ── Titans expansion ──────────────────────────────────────────────────────────

describe("Titans expansion", () => {
  describe("6 players", () => {
    it("returns all 5 titans shuffled", () => {
      const { order, wasShuffled } = computeNewOrder(
        titans,
        history({ order: [0, 1, 2, 3, 4] }),
        true, 6, 5
      );
      isPermutationOf(order, titans);
      expect(wasShuffled).toBe(true);
    });
  });

  describe("5 players", () => {
    it("last titan from previous round goes first", () => {
      const { order } = computeNewOrder(
        titans,
        history({ order: [3, 1, 4, 0, 2] }),
        true, 5, 5
      );
      expect(order[0]).toBe(2);
      isPermutationOf(order, titans);
    });
  });

  describe("4 players — alternating pattern", () => {
    it("when wasShuffled=true: last 2 go first, first 3 reshuffled", () => {
      const { order, wasShuffled } = computeNewOrder(
        titans,
        history({ order: [2, 0, 4, 1, 3], wasShuffled: true }),
        true, 4, 5
      );
      // Last 2 of [2,0,4,1,3] are [1,3] — must be first
      expect(order.slice(0, 2)).toEqual([1, 3]);
      // Remaining 3 positions contain the other titans
      isPermutationOf(order, titans);
      expect(wasShuffled).toBe(false);
    });

    it("when wasShuffled=false: reshuffles all titans", () => {
      const { order, wasShuffled } = computeNewOrder(
        titans,
        history({ order: [1, 3, 2, 0, 4], wasShuffled: false }),
        true, 4, 5
      );
      isPermutationOf(order, titans);
      expect(wasShuffled).toBe(true);
    });
  });

  describe("3 players — complex mixing rule", () => {
    it("positions 2–3 are always the first 2 gods of the previous round", () => {
      const prevOrder = [0, 1, 2, 3, 4];
      const { order } = computeNewOrder(
        titans,
        history({ order: prevOrder }),
        true, 3, 5
      );
      // Middle two positions must be the first two gods of last round
      expect(order.slice(2, 4)).toEqual([0, 1]);
      isPermutationOf(order, titans);
    });

    it("the last slot is always the leftover from the shuffled back-3", () => {
      // Run many times to verify the structural constraint holds
      for (let i = 0; i < 20; i++) {
        const { order } = computeNewOrder(
          titans,
          history({ order: [0, 1, 2, 3, 4] }),
          true, 3, 5
        );
        // Positions 0-1: two of [2,3,4]; position 2-3: [0,1]; position 4: remaining one of [2,3,4]
        const front2 = order.slice(0, 2);
        const back1 = order[4];
        expect(front2.every((g) => [2, 3, 4].includes(g))).toBe(true);
        expect([2, 3, 4].includes(back1)).toBe(true);
        expect(order[2]).toBe(0);
        expect(order[3]).toBe(1);
      }
    });
  });
});

// ── Output invariants (always true regardless of mode) ────────────────────────

describe("Output invariants", () => {
  const cases: Array<[string, boolean, number]> = [
    ["standard 5p", false, 5],
    ["standard 4p", false, 4],
    ["standard 3p", false, 3],
    ["titans 6p", true, 6],
    ["titans 5p", true, 5],
    ["titans 4p", true, 4],
    ["titans 3p", true, 3],
  ];

  it.each(cases)(
    "%s: output is always a valid permutation of the input",
    (_, isTitans, playerCount) => {
      const tiles = isTitans ? titans : gods;
      const { order } = computeNewOrder(
        tiles,
        history({ order: tiles }),
        isTitans,
        playerCount,
        tiles.length
      );
      isPermutationOf(order, tiles);
    }
  );
});
