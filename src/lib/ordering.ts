interface Ordered {
	id: string;
	data: {added: Date; order?: number | null | undefined};
}

/**
 * Newest additions first. Entries added on the same day keep their optional `order`; unordered ones follow by id.
 */
export function newestFirst<T extends Ordered>(entries: readonly T[]): T[] {
	return entries.toSorted(
		(a, b) =>
			b.data.added.getTime() - a.data.added.getTime() ||
			(a.data.order ?? Number.POSITIVE_INFINITY) - (b.data.order ?? Number.POSITIVE_INFINITY) ||
			a.id.localeCompare(b.id),
	);
}
