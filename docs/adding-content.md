# Adding content

## The easy way: the editor at /admin

Open <https://janesterlis.com/admin/> and sign in with GitHub. Pick a section (Gallery photos, Recordings, Tabs, Guitars, Gear, Pages, Links), click **New**, fill in the form, upload the photo or MP3, and click **Save**. Each save commits to GitHub, and the live site updates about a minute later.

To try changes before they go live, run `just dev`, open <http://localhost:4321/admin/index.html> in Chrome, and choose **Work with Local Repository**. Edits land in your local files; preview them at <http://localhost:4321>, then commit and push.

For tabs, put the tablature in a code block and set its language to `tab` so the columns line up.

## By hand

Every piece of content is one small file, usually next to its photo. Add the files, commit, and push. Cloudflare Pages rebuilds and publishes the site in about a minute.

Preview locally first with `just dev`, then open <http://localhost:4321>. Mistakes in a file's fields (a typo in `family`, a missing photo) stop the build with a message naming the file.

## A gallery photo

Put the photo and a Markdown file with the same name in `src/content/gallery/`:

```text
src/content/gallery/eric-johnson.jpg
src/content/gallery/eric-johnson.md
```

```markdown
---
image: ./eric-johnson.jpg
alt: Jan with Eric Johnson backstage
caption: With Eric Johnson at the Beacon Theatre
year: 2026
added: 2026-10-01
---
```

The newest `added` date shows first. `alt` describes the photo for screen readers; `caption` appears under it.

## A guitar

Put the photo and a Markdown file in `src/content/guitars/`. The file name becomes the web address, so `1959-gibson-les-paul.md` appears at `/collection/1959-gibson-les-paul/`.

```markdown
---
year: 1959
model: Gibson Les Paul Standard
family: gibson
image: ./1959-gibson-les-paul.jpg
alt: Cherry sunburst 1959 Les Paul on a stand
audio: /audio/1959-les-paul-demo.mp3
---

The story of this guitar goes here. As long as you like.
```

`family` is one of `gibson`, `stratocaster`, `telecaster`, or `other`. `audio` is optional.

## A song or recording

Copy the MP3 into `public/audio/`, then add a Markdown file to `src/content/recordings/`:

```markdown
---
title: Midnight blues
file: /audio/midnight-blues.mp3
year: 2026
added: 2026-10-01
---

A few words about the recording.
```

## A guitar tab

Add a Markdown file to `src/content/tabs/`. Write the tab itself inside a fenced block marked `tab`, and it keeps its columns on every screen size.

````markdown
---
title: Slow blues turnaround in A
date: 2026-10-01
key: A
difficulty: intermediate
recording: /audio/turnaround-demo.mp3
---

A turnaround I use at the end of every chorus.

```tab
e|-----------------5-8-5-----|
B|---------5-8-5-8-------8---|
G|-5-7-5-7-------------------|
D|---------------------------|
A|---------------------------|
E|---------------------------|
```
````

`tuning` defaults to standard. Set it for anything else, for example `tuning: [D, A, D, G, B, E]` shows "Drop D". Add `draft: true` to keep a tab hidden from the live site while you work on it; drafts still show under `just dev`.

## YouTube videos

Nothing to do. The Videos page and the home page read the latest uploads from [Jan's channel](https://www.youtube.com/@JanEsterlis) whenever the site builds, and the `refresh-videos` GitHub workflow checks every hour and rebuilds the site when a new upload appears.

## Everything else

- Gear: `src/content/gear/`, ordered by the `order` field.
- Links: `src/content/links.yaml`.
- Home page and biography text: `src/content/pages/home.md` and `bio.md`.
