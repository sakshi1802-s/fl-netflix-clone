export type CatalogMovie = {
  _id: string;
  title: string;
  description?: string;
  duration?: string;
  rating?: number;
  genre?: string;
};

export type Preferences = {
  genre?: string[];
  minDuration?: number;
  minRating?: number;
  mood?: string[];
};

/** Best-effort minutes from strings like "2h 15m", "135 min", "90m". */
export function parseDurationMinutes(s: string | undefined): number | null {
  if (!s) return null;
  const t = s.toLowerCase().replace(/\s+/g, " ");
  let total = 0;
  const h = t.match(/(\d+(?:\.\d+)?)\s*h/);
  const m = t.match(/(\d+(?:\.\d+)?)\s*m(?:in)?\b/);
  if (h) total += Math.round(parseFloat(h[1]) * 60);
  if (m) total += Math.round(parseFloat(m[1]));
  if (total > 0) return total;
  const digits = t.match(/(\d{2,4})\s*(?:min|minutes)?$/i);
  if (digits) return parseInt(digits[1], 10);
  const any = t.match(/(\d{2,3})/);
  return any ? parseInt(any[1], 10) : null;
}

function scoreMovie(m: CatalogMovie, preferences: Preferences): number {
  const minRating = preferences.minRating ?? 0;
  const minDuration = preferences.minDuration ?? 0;
  const genres = (preferences.genre ?? []).map((g) => g.toLowerCase());

  const r = typeof m.rating === "number" ? m.rating : Number(m.rating) || 0;
  if (r < minRating) return -1;

  const dm = parseDurationMinutes(m.duration);
  if (minDuration > 0 && dm != null && dm < minDuration) return -1;

  let score = r * 3 + (dm != null ? Math.min(dm / 30, 6) : 2);

  const g = (m.genre ?? "").toLowerCase();
  if (genres.length) {
    const hit = genres.some((pref) => g.includes(pref));
    score += hit ? 20 : 2;
  }

  return score;
}

/**
 * When the model returns titles/IDs that don’t line up with Mongo `_id`s,
 * still return watchable picks from the same catalog.
 */
export function fallbackRecommendations(
  movies: CatalogMovie[],
  preferences: Preferences
): { recommendation: { _id: string }[]; reason: string } {
  const scored = movies
    .map((m) => ({ m, score: scoreMovie(m, preferences) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score);

  const relaxed = movies
    .map((m) => ({ m, score: scoreMovieRelaxed(m, preferences) }))
    .sort((a, b) => b.score - a.score);

  const source = scored.length ? scored : relaxed;
  const top = source.slice(0, 5).map((x) => x.m);
  const final = top.length ? top : movies.slice(0, 5);

  return {
    recommendation: final.map((m) => ({ _id: String(m._id) })),
    reason:
      "Here are solid picks from your catalog based on your rating, runtime, and genre filters. (The AI’s IDs didn’t match your database, so we ranked titles locally instead.)",
  };
}

function scoreMovieRelaxed(m: CatalogMovie, preferences: Preferences): number {
  const r = typeof m.rating === "number" ? m.rating : Number(m.rating) || 0;
  const genres = (preferences.genre ?? []).map((g) => g.toLowerCase());
  const g = (m.genre ?? "").toLowerCase();
  let score = r * 3;
  if (genres.length) {
    score += genres.some((pref) => g.includes(pref)) ? 15 : 0;
  }
  return score;
}

export function normalizeCatalogMovies(movies: unknown[]): CatalogMovie[] {
  return (movies as Record<string, unknown>[]).map((m) => ({
    _id: String(m._id ?? ""),
    title: String(m.title ?? ""),
    description: m.description != null ? String(m.description) : undefined,
    duration: m.duration != null ? String(m.duration) : undefined,
    rating:
      typeof m.rating === "number"
        ? m.rating
        : m.rating != null
          ? Number(m.rating)
          : undefined,
    genre: m.genre != null ? String(m.genre) : undefined,
  }));
}

export function extractRecommendationItems(output: {
  recommendation?: unknown;
}): Array<{ _id?: string; title?: string }> {
  const rec = output.recommendation;
  if (!Array.isArray(rec)) return [];
  return rec.map((item: unknown) => {
    if (typeof item === "string") {
      const s = item.trim();
      return { _id: s, title: s };
    }
    if (item && typeof item === "object") {
      const io = item as Record<string, unknown>;
      const id = io._id != null ? String(io._id).trim() : undefined;
      const title = typeof io.title === "string" ? io.title.trim() : undefined;
      return { _id: id, title };
    }
    return {};
  });
}

export function matchRecommendationToCatalog(
  items: Array<{ _id?: string; title?: string }>,
  movies: CatalogMovie[]
): { _id: string }[] {
  const validIds = new Set(movies.map((m) => m._id));
  const byTitle = new Map(
    movies.map((m) => [m.title.trim().toLowerCase(), m._id] as const)
  );

  const out: { _id: string }[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    const id = item._id?.trim();
    if (id && validIds.has(id) && !seen.has(id)) {
      out.push({ _id: id });
      seen.add(id);
      continue;
    }
    const t = item.title?.trim().toLowerCase();
    if (t) {
      const found = byTitle.get(t);
      if (found && !seen.has(found)) {
        out.push({ _id: found });
        seen.add(found);
      }
    }
  }

  return out;
}
