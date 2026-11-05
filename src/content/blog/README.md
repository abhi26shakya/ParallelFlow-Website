# Writing a blog post

Anyone on the ParallelFlow team can publish a post. Each post is one file in
this folder, and it goes live when a pull request merges.

## 1. Add yourself as an author (first post only)

Open `authors.ts` and add an entry. The key is your author id:

```ts
export const AUTHORS: Record<string, Author> = {
  jane: { name: "Jane Doe", role: "Co-founder", avatar: "/blog/authors/jane.jpg" },
};
```

`avatar` is optional. Put a square image in `public/blog/authors/`. Without one,
your initials are shown.

## 2. Create the post

1. Copy `posts/_template.mdx` to `posts/<your-slug>.mdx`. The file name is the
   URL, for example `posts/how-we-plan-sprints.mdx` becomes
   `/blog/how-we-plan-sprints`. Use lowercase letters, numbers and hyphens.
2. Fill in `export const metadata` at the top:

| Field      | Required | Notes |
| ---------- | -------- | ----- |
| `title`    | yes | Keep it short; put the rest in `subtitle`. |
| `subtitle` | no  | Subheading under the title on the post page. Without one, the summary is shown there. |
| `summary`  | yes | One or two sentences. Shown on cards and in search results. |
| `date`     | yes | `YYYY-MM-DD`. Newest posts are shown first. |
| `author`   | yes | Your id from `authors.ts`. |
| `tags`     | yes | 1 to 4 topics, e.g. `["Engineering"]`. These become the filters. |
| `cover`    | no  | Image path under `public/blog/`, e.g. `/blog/how-we-plan-sprints/cover.jpg`. Shown on the post page and its card. Without one, the post page has no cover and the card shows a pattern generated from the slug. |
| `coverAlt` | with `cover` | What the cover shows. |
| `draft`    | no  | `true` hides the post everywhere except `npm run dev`. |

3. Write the body in Markdown below the metadata. `##` and `###` headings make
   up the post's table of contents. Images go in `public/blog/<your-slug>/`.

## 3. Preview and publish

```
npm run dev        # open http://localhost:3000/blog
npm run build      # fails with a clear message if the metadata is wrong
```

Open a pull request. The post goes live once it is merged and deployed.

## Content rules

The site is pre-launch and waitlist-first. Describe the product as what
ParallelFlow is "designed to" or "aims to" do. Don't publish prices, invented
metrics, customer names or testimonials, and don't mention SSO, compliance or
SLAs. See `CLAUDE.md` at the repo root.
