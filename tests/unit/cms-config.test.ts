import {existsSync, readdirSync, readFileSync} from "node:fs";
import {join} from "node:path";
import {parse} from "yaml";

interface CmsField {
	name: string;
	widget?: string;
	fields?: CmsField[];
}

interface CmsFile {
	name: string;
	file: string;
	fields: CmsField[];
}

interface CmsCollection {
	name: string;
	folder?: string;
	files?: CmsFile[];
	fields?: CmsField[];
}

interface CmsConfig {
	backend: {name: string; repo: string; branch: string};
	collections: CmsCollection[];
}

const root = join(import.meta.dirname, "../..");
const config = parse(readFileSync(join(root, "public/admin/config.yml"), "utf8")) as CmsConfig;
const repoPath = (path: string): string => join(root, path.replace(/^\//, ""));

const frontmatter = (path: string): Record<string, unknown> => {
	const match = /^---\n([\s\S]*?)\n---/.exec(readFileSync(path, "utf8"));
	return match?.[1] === undefined ? {} : (parse(match[1]) as Record<string, unknown>);
};

const undeclaredKeys = (path: string, fields: CmsField[]): string[] => {
	const declared = new Set(fields.map((field) => field.name));
	return Object.keys(frontmatter(path)).filter((key) => !declared.has(key));
};

describe("Sveltia CMS config", () => {
	it("commits to the site's GitHub repository", () => {
		expect(config.backend).toStrictEqual({name: "github", repo: "motlin/janesterlis.com", branch: "main"});
	});

	it("covers every content folder", () => {
		const cmsFolders = config.collections.flatMap((collection) =>
			collection.folder === undefined ? [] : [collection.folder],
		);
		const contentFolders = readdirSync(join(root, "src/content"), {withFileTypes: true})
			.filter((entry) => entry.isDirectory() && entry.name !== "pages")
			.map((entry) => `/src/content/${entry.name}`);

		expect(cmsFolders.toSorted()).toStrictEqual(contentFolders.toSorted());
	});

	for (const collection of config.collections) {
		if (collection.folder !== undefined) {
			const {folder, fields = []} = collection;
			it(`${collection.name}: declares every frontmatter key used by existing entries`, () => {
				const entries = readdirSync(repoPath(folder)).filter((name) => name.endsWith(".md"));
				const problems = entries.flatMap((entry) =>
					undeclaredKeys(join(repoPath(folder), entry), fields).map((key) => `${entry}: ${key}`),
				);

				expect(entries.length).toBeGreaterThan(0);
				expect(problems).toStrictEqual([]);
			});
		}

		for (const file of collection.files ?? []) {
			it(`${collection.name}/${file.name}: points at an existing file and declares all its keys`, () => {
				expect(existsSync(repoPath(file.file))).toBe(true);
				expect(undeclaredKeys(repoPath(file.file), file.fields)).toStrictEqual([]);
			});
		}
	}
});
