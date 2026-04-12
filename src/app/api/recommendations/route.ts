import { connectToDB } from "@/lib/db";
import Movie from "@/models/Movie";
import { geminiErrorToUserMessage } from "@/lib/geminiUserMessage";
import {
  extractRecommendationItems,
  fallbackRecommendations,
  matchRecommendationToCatalog,
  normalizeCatalogMovies,
  type CatalogMovie,
} from "@/lib/recommendationsFallback";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

function getApiKey() {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY
  );
}

const MODEL_CANDIDATES = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-2.0-flash",
];

export async function POST(req: NextRequest) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json(
      {
        message:
          "Set GEMINI_API_KEY (recommended) or NEXT_PUBLIC_GEMINI_API_KEY in .env for AI recommendations.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const preferences = body?.preferences ?? {};

    let rawMovies = body?.movies as unknown[];
    if (!Array.isArray(rawMovies) || rawMovies.length === 0) {
      await connectToDB();
      const fromDb = await Movie.find().lean();
      rawMovies = fromDb.map((m: any) => ({
        _id: String(m._id),
        title: m.title,
        description: m.description,
        duration: m.duration,
        rating: m.rating,
        genre: m.genre,
      }));
    }

    if (!Array.isArray(rawMovies) || rawMovies.length === 0) {
      return NextResponse.json(
        { message: "No movies in the catalog to recommend from." },
        { status: 400 }
      );
    }

    const catalog: CatalogMovie[] = normalizeCatalogMovies(rawMovies);

    const ai = new GoogleGenAI({ apiKey });

    const catalogForPrompt = catalog.map((m) => ({
      _id: m._id,
      title: m.title,
      genre: m.genre,
      rating: m.rating,
      duration: m.duration,
    }));

    const prompt = `You are a movie recommendation assistant for a Netflix-style app.

CATALOG — each line is one movie. You MUST copy _id EXACTLY (same string) for every recommendation:
${JSON.stringify(catalogForPrompt, null, 2)}

USER PREFERENCES:
${JSON.stringify(preferences, null, 2)}

Rules:
- Only recommend movies from the catalog above.
- Prefer genres/moods when they fit; otherwise still pick strong titles.
- minDuration = minimum runtime in minutes (parse each movie's duration string).
- minRating = minimum numeric rating when a rating exists.
- Return 1 to 5 movies.

Return ONLY valid JSON (no markdown) in this exact shape:
{"reason":"2-4 sentences","recommendation":[{"_id":"<paste exact _id from catalog>"}]}

You may also add "title" next to _id for clarity, but _id is required and must match the catalog.`;

    let raw: string | undefined;
    let lastModelError: unknown;

    for (const model of MODEL_CANDIDATES) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        const text = response.text?.trim();
        if (text) {
          raw = text;
          break;
        }
      } catch (e) {
        lastModelError = e;
        continue;
      }
    }

    if (!raw) {
      const fb = fallbackRecommendations(catalog, preferences);
      return NextResponse.json({
        ...fb,
        usedFallback: true,
      });
    }

    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let output: { reason?: string; recommendation?: unknown };
    try {
      output = JSON.parse(cleaned);
    } catch {
      const fb = fallbackRecommendations(catalog, preferences);
      return NextResponse.json({
        ...fb,
        usedFallback: true,
      });
    }

    const items = extractRecommendationItems(output);
    let normalized = matchRecommendationToCatalog(items, catalog);

    if (!normalized.length) {
      const fb = fallbackRecommendations(catalog, preferences);
      const aiReason =
        typeof output.reason === "string" && output.reason.trim()
          ? output.reason.trim()
          : "";
      return NextResponse.json({
        recommendation: fb.recommendation,
        reason: aiReason
          ? `${aiReason} ${fb.reason}`
          : fb.reason,
        usedFallback: true,
      });
    }

    return NextResponse.json({
      reason:
        typeof output.reason === "string" && output.reason.trim()
          ? output.reason
          : "Here are some picks from your catalog.",
      recommendation: normalized,
    });
  } catch (e: unknown) {
    console.error("recommendations route:", e);
    return NextResponse.json(
      { message: geminiErrorToUserMessage(e) },
      { status: 500 }
    );
  }
}
