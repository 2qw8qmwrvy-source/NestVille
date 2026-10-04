export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean);
}

type SearchableListing = {
  title: string;
  description: string;
  address: string;
  neighborhood: string | null;
};

const FIELD_WEIGHTS: { key: keyof SearchableListing; weight: number }[] = [
  { key: "title", weight: 3 },
  { key: "neighborhood", weight: 2 },
  { key: "address", weight: 1.5 },
  { key: "description", weight: 1 },
];

export function relevanceScore(listing: SearchableListing, words: string[]): number {
  if (words.length === 0) return 0;
  let score = 0;
  for (const { key, weight } of FIELD_WEIGHTS) {
    const value = (listing[key] ?? "").toLowerCase();
    for (const word of words) {
      if (value.includes(word)) score += weight;
    }
  }
  return score;
}

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "bedrooms", label: "Most bedrooms" },
] as const;
