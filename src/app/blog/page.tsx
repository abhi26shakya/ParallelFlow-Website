import type { Metadata } from "next";
import { BlogCover } from "@/components/blog/BlogCover";
import { BlogTagFilter } from "@/components/blog/BlogTagFilter";
import { FeaturedPost, PostCard } from "@/components/blog/PostCard";
import { BLOG_PAGE } from "@/content/blog/page-copy";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog | ParallelFlow",
  description: BLOG_PAGE.description,
  path: "/blog",
});

// Shown until the first post is published: a framed "first issue" panel,
// with no fake posts.
function EmptyState() {
  return (
    <div className="grid overflow-hidden rounded-card border border-line lg:grid-cols-12">
      <BlogCover
        seed="parallelflow-blog"
        label="Issue 001"
        className="relative aspect-[16/10] border-b border-line lg:col-span-7 lg:aspect-auto lg:min-h-[24rem] lg:border-b-0 lg:border-r"
      />
      <div className="flex flex-col justify-center p-8 lg:col-span-5 lg:p-10">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
          No posts yet
        </p>
        <h2 className="mt-5 text-3xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-4xl">
          {BLOG_PAGE.emptyTitle}
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          {BLOG_PAGE.emptyBody}
        </p>
      </div>
    </div>
  );
}

// The Blog index (owner request, 2026-10-25), in an editorial magazine
// layout: masthead, the newest post featured wide, then an asymmetric grid.
// Posts are .mdx files in src/content/blog/posts (see the README there).
export default async function BlogPage() {
  const posts = await getAllPosts();
  const tags = getAllTags(posts);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-24 sm:px-6 sm:pb-36 sm:pt-32">
      <header>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
          <span>ParallelFlow</span>
          <span aria-hidden="true" className="h-3 w-px bg-line" />
          <span>
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
          {tags.length > 0 && (
            <>
              <span aria-hidden="true" className="h-3 w-px bg-line" />
              <span>
                {tags.length} {tags.length === 1 ? "topic" : "topics"}
              </span>
            </>
          )}
        </p>
        {/* The tagline and the rule under the header were removed at the
            owner's request (2026-11-09). BLOG_PAGE.description is still the
            page's meta description. */}
        <h1 className="mt-6 text-[clamp(4rem,14vw,10rem)] font-medium leading-[0.85] tracking-[-0.06em]">
          {BLOG_PAGE.title}
        </h1>
      </header>

      <div className="mt-12 sm:mt-16">
        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <BlogTagFilter
            tags={tags}
            posts={posts.map((post) => ({
              slug: post.slug,
              tags: post.tags,
              featured: <FeaturedPost post={post} />,
              card: <PostCard post={post} />,
              wideCard: <PostCard post={post} wide />,
            }))}
          />
        )}
      </div>
    </main>
  );
}
