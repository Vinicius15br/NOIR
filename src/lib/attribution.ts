// Client-side attribution: captures UTM parameters and referrer on first visit
// (first-touch attribution) and persists them in sessionStorage for the whole
// browsing session, so the form submission can include the original source.

export type Attribution = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
  landing_path: string | null;
};

const STORAGE_KEY = "noir_attribution_v1";
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

function clean(v: string | null | undefined): string | null {
  if (!v) return null;
  const s = v.trim().slice(0, 200);
  return s.length ? s : null;
}

function emptyAttribution(): Attribution {
  return {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
    referrer: null,
    landing_path: null,
  };
}

/**
 * Capture attribution on page load. Uses first-touch: if attribution already
 * exists in sessionStorage, do not overwrite it (so a later visit to a page
 * without UTMs doesn't erase the original source). If a new URL has UTMs,
 * update — treating a fresh UTM'd click as a new touchpoint.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return emptyAttribution();

  try {
    const params = new URLSearchParams(window.location.search);
    const hasNewUtm = UTM_KEYS.some((k) => params.get(k));

    const stored = readAttribution();
    if (stored && !hasNewUtm) return stored;

    const referrer = clean(document.referrer);
    const sameOrigin =
      referrer && referrer.startsWith(window.location.origin);

    const next: Attribution = {
      utm_source: clean(params.get("utm_source")),
      utm_medium: clean(params.get("utm_medium")),
      utm_campaign: clean(params.get("utm_campaign")),
      utm_content: clean(params.get("utm_content")),
      utm_term: clean(params.get("utm_term")),
      referrer: sameOrigin ? null : referrer,
      landing_path: clean(window.location.pathname + window.location.search),
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return emptyAttribution();
  }
}

export function readAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Attribution>;
    return { ...emptyAttribution(), ...parsed };
  } catch {
    return null;
  }
}
