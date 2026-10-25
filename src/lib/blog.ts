// Blog posts: one .mdx file per post in src/content/blog/posts. Each post's
// `export const metadata` is checked here, so a typo or an unknown author
// fails the build instead of publishing a broken page.

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type { ComponentType } from "react";
import { z } from "zod";
import { AUTHORS, type Author } from "@/content/blog/authors";

const POSTS_DIR = path.join(process.cwd(), "src/content/blog/posts");
const WORDS_PER_MINUTE = 230;
const SHOW_DRAFTS = process.env.NODE_ENV === "development";

const postMetadataSchema = z
  .object({
    title: z.string().trim().min(1),
    summary: z.string().trim().min(1),
    date: z.iso.date(),
    author: z.string().refine((id) => id in AUTHORS, {
      message: "Unknown author id. Use an id from src/content/blog/authors.ts.",
    }),
    tags: z.array(z.string().trim().min(1)).min(1).max(4),
    cover: z.string().startsWith("/blog/").optional(),
    coverAlt: z.string().trim().min(1).optional(),
    draft: z.boolean().optional(),
  })
  .strict()
  .refine((m) => !m.cover || m.coverAlt, {
    message: "coverAlt is required when cover is set",
    path: ["coverAlt"],
  });

export type PostMetadata = z.infer<typeof postMetadataSchema>;

export type Heading = { id: string; text: string; level: 2 | 3 };

export type Post = PostMetadata & {
  slug: string;
  authorInfo: Author;
  readingMinutes: number;
  headings: Heading[];
};

// Slugs become URLs, so keep them to lowercase words and hyphens.
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function postSlugs(): string[] {
  return readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"))
    .map((file) => file.slice(0, -".mdx".length));
}

// The post body without its metadata export or MDX comments.
function bodyText(source: string): string {
  return source
    .replace(/^export const metadata = \{[\s\S]*?\n\};?\s*$/m, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
}

// Same ids rehype-slug gives the rendered headings, so the contents links match.
function extractHeadings(body: string): Heading[] {
  const slugger = new GithubSlugger();
  const withoutCode = body.replace(/^```[\s\S]*?^```/gm, "");
  return [...withoutCode.matchAll(/^(#{2,3})\s+(.+?)\s*#*\s*$/gm)].map(
    ([, hashes, raw]) => {
      const text = raw.replace(/[*_`]|\[([^\]]*)\]\([^)]*\)/g, "$1");
      return { id: slugger.slug(text), text, level: hashes.length as 2 | 3 };
    },
  );
}

async function loadPost(slug: string): Promise<Post> {
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(
      `Blog post file "${slug}.mdx": use lowercase letters, numbers and hyphens only.`,
    );
  }
  const { metadata } = await import(`@/content/blog/posts/${slug}.mdx`);
  const parsed = postMetadataSchema.safeParse(metadata);
  if (!parsed.success) {
    throw new Error(
      `Blog post "${slug}.mdx" has invalid metadata:\n${z.prettifyError(parsed.error)}`,
    );
  }
  const body = bodyText(readFileSync(path.join(POSTS_DIR, `${slug}.mdx`), "utf8"));
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    ...parsed.data,
    slug,
    authorInfo: AUTHORS[parsed.data.author],
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    headings: extractHeadings(body),
  };
}

// Published posts, newest first. Drafts are included only in `next dev`.
export async function getAllPosts(): Promise<Post[]> {
  const posts = await Promise.all(postSlugs().map(loadPost));
  return posts
    .filter((post) => SHOW_DRAFTS || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

export async function getPostContent(
  slug: string,
): Promise<ComponentType> {
  const { default: Content } = await import(`@/content/blog/posts/${slug}.mdx`);
  return Content;
}

export function getAllTags(posts: Post[]): string[] {
  return [...new Set(posts.flatMap((post) => post.tags))].sort();
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

export function formatPostDate(date: string): string {
  return DATE_FORMAT.format(new Date(`${date}T00:00:00Z`));
}
