import {formatTuning, publishedTabs} from "../../src/lib/tabs";

describe("formatTuning", () => {
	it("names standard tuning", () => {
		expect(formatTuning(["E", "A", "D", "G", "B", "E"])).toBe("Standard (E A D G B E)");
	});

	it("names drop D", () => {
		expect(formatTuning(["D", "A", "D", "G", "B", "E"])).toBe("Drop D (D A D G B E)");
	});

	it("names half-step down", () => {
		expect(formatTuning(["Eb", "Ab", "Db", "Gb", "Bb", "Eb"])).toBe("Half step down (Eb Ab Db Gb Bb Eb)");
	});

	it("lists the notes of any other tuning", () => {
		expect(formatTuning(["D", "G", "D", "G", "B", "D"])).toBe("D G D G B D");
	});
});

describe("publishedTabs", () => {
	const tab = (id: string, date: string, draft = false) => ({id, data: {date: new Date(date), draft}});
	const tabs = [tab("old", "2026-01-01"), tab("draft", "2026-09-01", true), tab("new", "2026-06-01")];

	it("hides drafts and lists newest first", () => {
		expect(publishedTabs(tabs, false).map((t) => t.id)).toStrictEqual(["new", "old"]);
	});

	it("includes drafts when previewing", () => {
		expect(publishedTabs(tabs, true).map((t) => t.id)).toStrictEqual(["draft", "new", "old"]);
	});
});
