const NAMED_TUNINGS: Record<string, string> = {
	"E A D G B E": "Standard",
	"D A D G B E": "Drop D",
	"Eb Ab Db Gb Bb Eb": "Half step down",
};

export function formatTuning(strings: readonly string[]): string {
	const notes = strings.join(" ");
	const name = NAMED_TUNINGS[notes];
	return name === undefined ? notes : `${name} (${notes})`;
}

interface Publishable {
	data: {date: Date; draft: boolean};
}

export function publishedTabs<T extends Publishable>(tabs: readonly T[], showDrafts: boolean): T[] {
	return tabs
		.filter((tab) => showDrafts || !tab.data.draft)
		.toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
