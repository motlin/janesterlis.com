import {guitarTitle, sortGuitars} from "../../src/lib/guitars";

const guitar = (id: string, family: "gibson" | "stratocaster" | "telecaster" | "other", year: number) => ({
	id,
	data: {family, year},
});

describe("sortGuitars", () => {
	it("groups Gibsons, then Strats, then Teles, then others, oldest first within each family", () => {
		const sorted = sortGuitars([
			guitar("tele-68", "telecaster", 1968),
			guitar("prs", "other", 2005),
			guitar("strat-61", "stratocaster", 1961),
			guitar("gold-top", "gibson", 1968),
			guitar("tele-52", "telecaster", 1952),
			guitar("es-335", "gibson", 1958),
			guitar("strat-56", "stratocaster", 1956),
		]);

		expect(sorted.map((g) => g.id)).toStrictEqual([
			"es-335",
			"gold-top",
			"strat-56",
			"strat-61",
			"tele-52",
			"tele-68",
			"prs",
		]);
	});

	it("does not mutate its input", () => {
		const input = [guitar("b", "gibson", 1968), guitar("a", "gibson", 1958)];
		sortGuitars(input);
		expect(input.map((g) => g.id)).toStrictEqual(["b", "a"]);
	});
});

describe("guitarTitle", () => {
	it("prefixes the model with its year", () => {
		expect(guitarTitle({year: 1961, model: "Gibson SG"})).toBe("1961 Gibson SG");
	});
});
