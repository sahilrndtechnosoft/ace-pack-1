/**
 * Splits items, in order, into `count` consecutive groups whose total weights are as even as possible
 * (minimises the heaviest group). Used to lay out menu columns that CSS columns balance badly.
 */
export function splitBalanced<T>(items: T[], count: number, weight: (item: T) => number): T[][] {
  const n = items.length;
  if (n === 0) return [];
  const k = Math.max(1, Math.min(count, n));
  const prefix = [0];
  for (const item of items) prefix.push(prefix[prefix.length - 1] + weight(item));
  const span = (from: number, to: number) => prefix[to] - prefix[from];

  // best[g][i]: smallest possible heaviest group when the first i items form g groups.
  const best = Array.from({ length: k + 1 }, () => new Array(n + 1).fill(Infinity));
  const cut = Array.from({ length: k + 1 }, () => new Array(n + 1).fill(0));
  best[0][0] = 0;
  for (let g = 1; g <= k; g++) {
    for (let i = g; i <= n; i++) {
      for (let j = g - 1; j < i; j++) {
        const cost = Math.max(best[g - 1][j], span(j, i));
        if (cost < best[g][i]) { best[g][i] = cost; cut[g][i] = j; }
      }
    }
  }

  const groups: T[][] = [];
  for (let g = k, i = n; g > 0; g--) {
    const j = cut[g][i];
    groups.unshift(items.slice(j, i));
    i = j;
  }
  return groups;
}
