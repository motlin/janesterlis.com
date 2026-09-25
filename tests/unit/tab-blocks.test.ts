import {markdownToHtml} from "satteri";
import {tabBlocks} from "../../src/lib/tab-blocks";

const render = (markdown: string): string => markdownToHtml(markdown, {mdastPlugins: [tabBlocks]}).html.trim();

describe("tabBlocks", () => {
	it("renders tab fences as escaped, labelled, scrollable blocks", () => {
		const html = render("```tab\ne|--0--|\nB|--<1>&-|\n```");

		expect(html).toBe(
			'<pre class="tab" tabindex="0" aria-label="Guitar tablature"><code>e|--0--|\nB|--&lt;1&gt;&amp;-|</code></pre>',
		);
	});

	it("leaves other code fences to the normal renderer", () => {
		const html = render("```js\nconst a = 1;\n```");

		expect(html).not.toContain('class="tab"');
		expect(html).toContain("const a = 1;");
	});
});
