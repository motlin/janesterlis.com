export const GUITAR_FAMILIES = ["gibson", "stratocaster", "telecaster", "other"] as const;

export type GuitarFamily = (typeof GUITAR_FAMILIES)[number];

export const FAMILY_LABELS: Record<GuitarFamily, string> = {
	gibson: "Gibsons",
	stratocaster: "Stratocasters",
	telecaster: "Telecasters",
	other: "And more",
};

interface Sortable {
	data: {family: GuitarFamily; year: number};
}

export function sortGuitars<T extends Sortable>(guitars: readonly T[]): T[] {
	return guitars.toSorted(
		(a, b) =>
			GUITAR_FAMILIES.indexOf(a.data.family) - GUITAR_FAMILIES.indexOf(b.data.family) ||
			a.data.year - b.data.year,
	);
}

export function guitarTitle({year, model}: {year: number; model: string}): string {
	return `${year} ${model}`;
}
