export const NAV_ITEMS = [
	{href: "/bio/", label: "Biography"},
	{href: "/collection/", label: "Collection"},
	{href: "/gear/", label: "Gear"},
	{href: "/gallery/", label: "Gallery"},
	{href: "/listen/", label: "Listen"},
	{href: "/videos/", label: "Videos"},
	{href: "/tv/", label: "TV Appearances"},
	{href: "/tabs/", label: "Tabs"},
	{href: "/links/", label: "Links"},
] as const;

export function isCurrent(pathname: string, href: string): boolean {
	return pathname.startsWith(href);
}
