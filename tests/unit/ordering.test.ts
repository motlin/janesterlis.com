import {newestFirst} from "../../src/lib/ordering";

const entry = (id: string, added: string, order?: number | null) => ({id, data: {added: new Date(added), order}});

describe("newestFirst", () => {
	it("puts the most recently added entries first", () => {
		const sorted = newestFirst([
			entry("old", "2026-09-25"),
			entry("new", "2027-01-15"),
			entry("mid", "2026-12-01"),
		]);
		expect(sorted.map((e) => e.id)).toStrictEqual(["new", "mid", "old"]);
	});

	it("breaks ties with the optional order field, then by id", () => {
		const sorted = newestFirst([
			entry("c", "2026-09-25"),
			entry("b", "2026-09-25", 2),
			entry("a", "2026-09-25"),
			entry("d", "2026-09-25", 1),
		]);
		expect(sorted.map((e) => e.id)).toStrictEqual(["d", "b", "a", "c"]);
	});

	it("sorts a null order like a missing one", () => {
		const sorted = newestFirst([
			entry("b", "2026-09-25", null),
			entry("c", "2026-09-25", 1),
			entry("a", "2026-09-25"),
		]);
		expect(sorted.map((e) => e.id)).toStrictEqual(["c", "a", "b"]);
	});
});
