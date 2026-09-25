import {NAV_ITEMS, isCurrent} from "../../src/lib/nav";

describe("NAV_ITEMS", () => {
	it("lists every section in reading order", () => {
		expect(NAV_ITEMS.map((item) => item.label)).toStrictEqual([
			"Biography",
			"Collection",
			"Gear",
			"Gallery",
			"Listen",
			"Videos",
			"TV Appearances",
			"Tabs",
			"Links",
		]);
	});
});

describe("isCurrent", () => {
	it("matches a section and the pages beneath it", () => {
		expect(isCurrent("/collection/", "/collection/")).toBe(true);
		expect(isCurrent("/collection/1961-gibson-sg/", "/collection/")).toBe(true);
	});

	it("does not match other sections or partial names", () => {
		expect(isCurrent("/gear/", "/collection/")).toBe(false);
		expect(isCurrent("/tabsheet/", "/tabs/")).toBe(false);
	});
});
