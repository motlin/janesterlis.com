export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@JanEsterlis";
export const YOUTUBE_FEED_URL = "https://www.youtube.com/feeds/videos.xml?channel_id=UCnUnYSDt9f9aak7xOp_yCQg";

export interface Video {
	id: string;
	title: string;
	published: Date;
	description: string;
}

const ENTITIES: Record<string, string> = {"&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'", "&#39;": "'"};

// &amp; is decoded last so "&amp;lt;" stays "&lt;".
const decode = (text: string): string =>
	text.replaceAll(/&(?:lt|gt|quot|apos|#39);/g, (entity) => ENTITIES[entity] ?? entity).replaceAll("&amp;", "&");

const tag = (xml: string, name: string): string | undefined => {
	const match = new RegExp(`<${name}>([\\s\\S]*?)</${name}>`).exec(xml);
	return match?.[1] === undefined ? undefined : decode(match[1].trim());
};

/**
 * Parses a YouTube channel's Atom feed, which lists its 15 most recent uploads.
 */
export function parseYouTubeFeed(xml: string): Video[] {
	const videos: Video[] = [];
	for (const [, entry = ""] of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
		const id = tag(entry, "yt:videoId");
		const published = tag(entry, "published");
		if (id === undefined || published === undefined) {
			continue;
		}
		videos.push({
			id,
			title: tag(entry, "title") ?? "",
			published: new Date(published),
			description: tag(entry, "media:description") ?? "",
		});
	}
	return videos;
}
