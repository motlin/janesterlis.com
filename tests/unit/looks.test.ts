import {DEFAULT_LOOK, LOOKS, resolveLook} from "../../src/lib/looks";

describe("LOOKS", () => {
	it("offers the three candidate designs with stage as the default", () => {
		expect(LOOKS.map((look) => look.id)).toStrictEqual(["stage", "catalog", "gallery"]);
		expect(DEFAULT_LOOK).toBe("stage");
	});
});

describe("resolveLook", () => {
	const ids = ["stage", "catalog", "gallery"];

	it("prefers a valid query-string look over the stored one", () => {
		expect(resolveLook(ids, "stage", "gallery", "catalog")).toBe("gallery");
	});

	it("falls back to the stored look when the query is missing or invalid", () => {
		expect(resolveLook(ids, "stage", null, "catalog")).toBe("catalog");
		expect(resolveLook(ids, "stage", "neon", "catalog")).toBe("catalog");
	});

	it("falls back to the default when neither source is valid", () => {
		expect(resolveLook(ids, "stage", null, null)).toBe("stage");
		expect(resolveLook(ids, "stage", "", "bogus")).toBe("stage");
	});
});
