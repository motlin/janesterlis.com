import {defineCollection} from "astro:content";
import {file, glob} from "astro/loaders";
import {z} from "astro/zod";
import {GUITAR_FAMILIES} from "./lib/guitars";
import {YOUTUBE_FEED_URL, parseYouTubeFeed} from "./lib/youtube";

const pages = defineCollection({
	loader: glob({pattern: "*.md", base: "./src/content/pages"}),
	schema: ({image}) =>
		z.object({
			title: z.string(),
			description: z.string(),
			photos: z.array(z.object({image: image(), alt: z.string(), caption: z.string()})).default([]),
		}),
});

const guitars = defineCollection({
	loader: glob({pattern: "*.md", base: "./src/content/guitars"}),
	schema: ({image}) =>
		z.object({
			year: z.number().int(),
			model: z.string(),
			family: z.enum(GUITAR_FAMILIES),
			image: image(),
			alt: z.string(),
			audio: z.string().nullish(),
		}),
});

const gear = defineCollection({
	loader: glob({pattern: "*.md", base: "./src/content/gear"}),
	schema: ({image}) =>
		z.object({
			title: z.string(),
			order: z.number(),
			image: image(),
			alt: z.string(),
		}),
});

// `added` sorts newest first; `order` only breaks ties between entries added on the same day.
const ordering = {
	added: z.coerce.date(),
	order: z.number().nullish(),
};

const gallery = defineCollection({
	loader: glob({pattern: "*.md", base: "./src/content/gallery"}),
	schema: ({image}) =>
		z.object({
			image: image(),
			alt: z.string(),
			caption: z.string(),
			year: z.number().int().nullish(),
			...ordering,
		}),
});

const recordings = defineCollection({
	loader: glob({pattern: "*.md", base: "./src/content/recordings"}),
	schema: z.object({
		title: z.string(),
		file: z.string().startsWith("/audio/"),
		year: z.number().int().nullish(),
		...ordering,
	}),
});

const links = defineCollection({
	loader: file("./src/content/links.yaml"),
	schema: z.object({
		title: z.string(),
		url: z.url(),
		description: z.string(),
	}),
});

// Entry ids are YouTube video ids. These are older than the channel feed's 15 most recent uploads, so they are listed by hand.
const tv = defineCollection({
	loader: file("./src/content/tv.yaml"),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
	}),
});

// Fetched from the channel's public feed on every build, so new uploads appear after the next deploy.
const videos = defineCollection({
	loader: {
		name: "youtube-feed",
		load: async ({store, logger, parseData}) => {
			let xml: string;
			try {
				const response = await fetch(YOUTUBE_FEED_URL);
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`);
				}
				xml = await response.text();
			} catch (error) {
				logger.warn(`Keeping cached videos; could not fetch the YouTube feed: ${String(error)}`);
				return;
			}
			store.clear();
			for (const {id, ...video} of parseYouTubeFeed(xml)) {
				store.set({id, data: await parseData({id, data: video})});
			}
		},
	},
	schema: z.object({
		title: z.string(),
		published: z.date(),
		description: z.string(),
	}),
});

export const collections = {pages, guitars, gear, gallery, recordings, links, tv, videos};
