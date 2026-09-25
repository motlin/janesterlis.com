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
			audio: z.string().optional(),
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
	order: z.number().optional(),
};

const gallery = defineCollection({
	loader: glob({pattern: "*.md", base: "./src/content/gallery"}),
	schema: ({image}) =>
		z.object({
			image: image(),
			alt: z.string(),
			caption: z.string(),
			year: z.number().int().optional(),
			...ordering,
		}),
});

const recordings = defineCollection({
	loader: glob({pattern: "*.md", base: "./src/content/recordings"}),
	schema: z.object({
		title: z.string(),
		file: z.string().startsWith("/audio/"),
		year: z.number().int().optional(),
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

const tabs = defineCollection({
	loader: glob({pattern: "*.md", base: "./src/content/tabs"}),
	schema: z.object({
		title: z.string(),
		artist: z.string().optional(),
		date: z.coerce.date(),
		tuning: z.array(z.string()).length(6).default(["E", "A", "D", "G", "B", "E"]),
		key: z.string().optional(),
		difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
		recording: z.string().startsWith("/audio/").optional(),
		draft: z.boolean().default(false),
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

export const collections = {pages, guitars, gear, gallery, recordings, links, tabs, videos};
