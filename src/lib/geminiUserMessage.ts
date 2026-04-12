/**
 * Turn Google GenAI / Gemini errors into short, user-safe copy (no raw JSON blobs).
 */
export function geminiErrorToUserMessage(err: unknown): string {
  const raw =
    err instanceof Error
      ? err.message
      : typeof err === "string"
        ? err
        : "";

  if (!raw) {
    return "Recommendations are temporarily unavailable. Please try again.";
  }

  let status: string | undefined;
  let apiMessage: string | undefined;

  try {
    const parsed = JSON.parse(raw) as {
      error?: { status?: string; message?: string };
    };
    status = parsed?.error?.status;
    apiMessage = parsed?.error?.message;
  } catch {
    // not JSON — inspect raw string
  }

  const combined = `${status ?? ""} ${apiMessage ?? ""} ${raw}`.toLowerCase();

  if (
    status === "RESOURCE_EXHAUSTED" ||
    combined.includes("resource_exhausted") ||
    combined.includes("quota") ||
    combined.includes("rate limit") ||
    combined.includes("429")
  ) {
    return "Gemini free-tier quota was reached for that model. We tried other models; wait a minute and try again, or check billing / limits in Google AI Studio.";
  }

  if (
    status === "PERMISSION_DENIED" ||
    status === "UNAUTHENTICATED" ||
    combined.includes("api key") ||
    combined.includes("invalid_argument") && combined.includes("key")
  ) {
    return "Invalid or missing Gemini API key. Set GEMINI_API_KEY in .env and restart the dev server.";
  }

  if (apiMessage && apiMessage.length <= 180) {
    return apiMessage;
  }

  return "Recommendations are temporarily unavailable. Please try again in a moment.";
}
