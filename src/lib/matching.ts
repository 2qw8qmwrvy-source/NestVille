export type MatchablePost = {
  price: number | null;
  location: string | null;
  moveInDate: Date | null;
  moveOutDate: Date | null;
};

export type MatchResult = {
  score: number;
  reasons: string[];
};

const FAR_FUTURE = new Date(8640000000000000);

function priceScore(a: number | null, b: number | null): number | null {
  if (a === null || b === null) return null;
  const diff = Math.abs(a - b);
  if (diff <= 100) return 1;
  if (diff >= 400) return 0;
  return 1 - (diff - 100) / 300;
}

function locationScore(a: string | null, b: string | null): number | null {
  const na = a?.trim().toLowerCase();
  const nb = b?.trim().toLowerCase();
  if (!na || !nb) return null;
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.75;
  const wordsA = new Set(na.split(/\s+/));
  const overlap = nb.split(/\s+/).some((w) => wordsA.has(w));
  return overlap ? 0.5 : 0;
}

function dateScore(
  aStart: Date | null,
  aEnd: Date | null,
  bStart: Date | null,
  bEnd: Date | null
): number | null {
  if (!aStart || !bStart) return null;
  const overlaps = aStart <= (bEnd ?? FAR_FUTURE) && bStart <= (aEnd ?? FAR_FUTURE);
  if (overlaps) return 1;
  const diffDays = Math.abs(aStart.getTime() - bStart.getTime()) / 86_400_000;
  if (diffDays <= 14) return 0.6;
  if (diffDays <= 30) return 0.3;
  return 0;
}

export function scoreMatch(a: MatchablePost, b: MatchablePost): MatchResult {
  const components = [
    { label: "Similar budget", value: priceScore(a.price, b.price) },
    { label: "Same area", value: locationScore(a.location, b.location) },
    {
      label: "Overlapping dates",
      value: dateScore(a.moveInDate, a.moveOutDate, b.moveInDate, b.moveOutDate),
    },
  ];

  const applicable = components.filter(
    (c): c is { label: string; value: number } => c.value !== null
  );
  if (applicable.length === 0) return { score: 0, reasons: [] };

  const avg = applicable.reduce((sum, c) => sum + c.value, 0) / applicable.length;
  const reasons = applicable.filter((c) => c.value >= 0.6).map((c) => c.label);

  return { score: Math.round(avg * 100), reasons };
}

export function rankMatches<T extends MatchablePost>(
  target: MatchablePost,
  candidates: T[],
  limit = 3
) {
  return candidates
    .map((post) => ({ post, ...scoreMatch(target, post) }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
