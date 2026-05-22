import shuffle from "lodash/shuffle";
import last from "lodash/last";
import type { ShuffleHistoryEntry } from "../Components/AppContainer";

/**
 * Computes the next god ordering for the start of a Cyclades round.
 * Pure function — no side effects, fully testable.
 */
export function computeNewOrder(
  current: number[],
  shuffleHistory: ShuffleHistoryEntry[],
  isTitans: boolean,
  playerCount: number,
  tilesLength: number
): { order: number[]; wasShuffled: boolean } {
  const lastRoll = last(shuffleHistory)!;
  const lastOrder = lastRoll.order;

  if (!isTitans) {
    // ── Standard gods (4 tiles: Ares, Athena, Zeus, Poseidon) ─────────────
    if (playerCount === 5) {
      return { order: shuffle(current), wasShuffled: true };
    }

    if (playerCount === 4 || playerCount === 2) {
      // Last god from the previous round goes first; rest are reshuffled
      const lastGod = last(lastOrder)!;
      const rest = shuffle(current.filter((g) => g !== lastGod));
      return { order: [lastGod, ...rest], wasShuffled: true };
    }

    if (playerCount === 3) {
      if (lastRoll.wasShuffled) {
        // Last 2 gods swap to the front, first 2 swap to the back
        return {
          order: [...lastOrder.slice(2, 4), ...lastOrder.slice(0, 2)],
          wasShuffled: false,
        };
      }
      // Next turn: fully reshuffle
      return { order: shuffle(current), wasShuffled: true };
    }
  } else {
    // ── Titans expansion (5 tiles: + Kronos) ──────────────────────────────
    if (playerCount === 6) {
      return { order: shuffle(current), wasShuffled: true };
    }

    if (playerCount === 5) {
      // Last titan from the previous round goes first; rest are reshuffled
      const lastGod = last(lastOrder)!;
      const rest = shuffle(current.filter((g) => g !== lastGod));
      return { order: [lastGod, ...rest], wasShuffled: true };
    }

    if (playerCount === 4) {
      if (lastRoll.wasShuffled) {
        // Last 2 titans go first; first 3 are reshuffled
        return {
          order: [...lastOrder.slice(3, 5), ...shuffle(lastOrder.slice(0, 3))],
          wasShuffled: false,
        };
      }
      return { order: shuffle(current), wasShuffled: true };
    }

    if (playerCount === 3) {
      // Last 3 titans shuffled → first 2 of them lead, then the first 2
      // from last round, then the leftover titan at the end
      const shuffledLast3 = shuffle(lastOrder.slice(2, 5));
      return {
        order: [
          ...shuffledLast3.slice(0, 2),
          ...lastOrder.slice(0, 2),
          last(shuffledLast3)!,
        ],
        wasShuffled: true,
      };
    }
  }

  // Fallback (shouldn't be reached with valid playerCount)
  return { order: shuffle(current), wasShuffled: true };
}
