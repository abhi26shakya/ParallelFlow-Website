import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorChip } from "@/components/blog/AuthorChip";
import { PostCard, PostMeta, PostTags } from "@/components/blog/PostCard";
import { PostCover } from "@/components/blog/PostCover";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { getAllPosts, getPostContent } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

// A slug not listed by generateStaticParams waits for its complete static
// render instead of streaming the shared shell first, so an unknown slug
// gets a real 404 status rather than a 200 page saying "not found".
// (dynamicParams = false is not allowed with Cache Components.)
export const ensureStatic = "navigation";

// Cache Components rejects an empty list here, so until the first post
// exists this one placeholder slug is prerendered, and it renders the 404.
const NO_POSTS_SLUG = "no-posts-yet";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.length > 0
    ? posts.map((post) => ({ slug: post.slug }))
    : [{ slug: NO_POSTS_SLUG }];
}

async function findPost(slug: string) {
  const posts = await getAllPosts();
  return { post: posts.find((p) => p.slug === slug), posts };
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await findPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: `${post.subtitle ? `${post.title}: ${post.subtitle}` : post.title} | ParallelFlow Blog`,
    description: post.summary,
    path: `/blog/${post.slug}`,
    article: { publishedTime: post.date, authors: [post.authorInfo.name] },
  });
}

const ARTICLE_ID = "post-body";

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  // Only slugs from the posts folder reach the import below.
  const { post, posts } = await findPost(slug);
  if (!post) notFound();
  const Content = await getPostContent(post.slug);
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <main className="pb-28 sm:pb-36">
      <ReadingProgress targetId={ARTICLE_ID} />

      <header className="mx-auto max-w-5xl px-4 pt-16 text-center sm:px-6 sm:pt-24">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft
            aria-hidden="true"
            className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          All posts
        </Link>
        <div className="mt-10">
          <PostTags tags={post.tags} className="justify-center" />
        </div>
        {/* Sized so a short title fits on one line from phones up; longer
            titles wrap evenly. */}
        <h1 className="mt-6 text-balance text-[clamp(1.75rem,7vw,4rem)] font-medium leading-[1.05] tracking-[-0.04em]">
          {post.title}
        </h1>
        {/* The subtitle is the subheading; posts without one show their summary. */}
        <p className="mx-auto mt-6 max-w-2xl text-balance text-xl leading-snug text-foreground sm:text-2xl">
          {post.subtitle ?? post.summary}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          <AuthorChip author={post.authorInfo} showRole size={36} />
          <span aria-hidden="true" className="hidden h-6 w-px bg-line sm:block" />
          <PostMeta post={post} />
        </div>
      </header>

      {/* Only a real cover image is shown here. The generated pattern is
          filler, so it stays on the /blog cards. */}
      {post.cover && (
        <div className="mx-auto mt-14 max-w-6xl px-4 sm:px-6">
          <PostCover
            post={post}
            sizes="(min-width: 1152px) 1152px, 100vw"
            priority
            className="aspect-[21/9] rounded-card border border-line"
          />
        </div>
      )}

      <div className="mx-auto mt-6 grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <article id={ARTICLE_ID} className="mx-auto w-full max-w-[68ch] lg:mx-0 lg:ml-auto">
          <Content />
        </article>
        {post.headings.length > 1 && (
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--navbar-height)+3rem)] mt-16">
              <TableOfContents headings={post.headings} />
            </div>
          </aside>
        )}
      </div>

      {more.length > 0 && (
        <section aria-labelledby="more-posts" className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between border-b border-line pb-6">
            <h2 id="more-posts" className="text-3xl font-medium tracking-tight">
              More from the blog
            </h2>
            <Link href="/blog" className="text-sm text-muted transition-colors hover:text-foreground">
              View all
            </Link>
          </div>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {more.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
