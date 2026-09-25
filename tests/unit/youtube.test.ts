import {parseYouTubeFeed} from "../../src/lib/youtube";

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
	<title>Channel name</title>
	<entry>
		<id>yt:video:abc123</id>
		<yt:videoId>abc123</yt:videoId>
		<title>Blues &amp; more</title>
		<published>2026-02-19T16:42:32+00:00</published>
		<media:group>
			<media:title>Blues &amp; more</media:title>
			<media:description>Line one
Line &quot;two&quot;</media:description>
		</media:group>
	</entry>
	<entry>
		<yt:videoId>def456</yt:videoId>
		<title>Winter theme</title>
		<published>2025-12-18T01:15:10+00:00</published>
		<media:group>
			<media:description></media:description>
		</media:group>
	</entry>
</feed>`;

describe("parseYouTubeFeed", () => {
	it("extracts each video's id, decoded title, publish date, and description", () => {
		expect(parseYouTubeFeed(feed)).toStrictEqual([
			{
				id: "abc123",
				title: "Blues & more",
				published: new Date("2026-02-19T16:42:32+00:00"),
				description: 'Line one\nLine "two"',
			},
			{
				id: "def456",
				title: "Winter theme",
				published: new Date("2025-12-18T01:15:10+00:00"),
				description: "",
			},
		]);
	});

	it("returns no videos for a feed without entries", () => {
		expect(parseYouTubeFeed("<feed><title>Empty</title></feed>")).toStrictEqual([]);
	});

	it("skips entries missing a video id or date", () => {
		expect(parseYouTubeFeed("<feed><entry><title>Broken</title></entry></feed>")).toStrictEqual([]);
	});
});
