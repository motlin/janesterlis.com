import {defineMdastPlugin} from "satteri";

const escapeHtml = (text: string): string =>
	text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/**
 * Renders ```tab fences as monospace blocks that keep their columns, bypassing syntax highlighting.
 */
export const tabBlocks = defineMdastPlugin({
	name: "tab-blocks",
	code(node, ctx) {
		if (node.lang === "tab") {
			ctx.replaceNode(node, {
				type: "html",
				value: `<pre class="tab" tabindex="0" aria-label="Guitar tablature"><code>${escapeHtml(node.value)}</code></pre>`,
			});
		}
	},
});
