export const LOOKS = [
	{id: "stage", label: "Stage", description: "Dark, amp-glow concert feel"},
	{id: "catalog", label: "Catalog", description: "Warm vintage catalog"},
	{id: "gallery", label: "Gallery", description: "Clean minimal gallery"},
] as const;

export type LookId = (typeof LOOKS)[number]["id"];

export const DEFAULT_LOOK: LookId = "stage";

export const LOOK_STORAGE_KEY = "look";

/**
 * Must stay self-contained: BaseLayout inlines its source into <head> so the look applies before first paint.
 */
export function resolveLook(
	ids: readonly string[],
	fallback: string,
	fromQuery: string | null,
	fromStorage: string | null,
): string {
	if (fromQuery !== null && ids.includes(fromQuery)) {
		return fromQuery;
	}
	if (fromStorage !== null && ids.includes(fromStorage)) {
		return fromStorage;
	}
	return fallback;
}
