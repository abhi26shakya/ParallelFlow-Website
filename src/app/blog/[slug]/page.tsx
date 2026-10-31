import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorAvatar, AuthorChip } from "@/components/blog/AuthorChip";
import { PostCard, PostMeta, PostTags } from "@/components/blog/PostCard";
import { PostCover } from "@/components/blog/PostCover";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { WaitlistButton } from "@/components/waitlist/WaitlistButton";
import { VALUE_PROPOSITION } from "@/content/home";
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
    title: `${post.title} | ParallelFlow Blog`,
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

      <header className="mx-auto max-w-4xl px-4 pt-16 sm:px-6 sm:pt-24">
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
          <PostTags tags={post.tags} />
        </div>
        <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.04em]">
          {post.title}
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">
          {post.summary}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-line py-5">
          <AuthorChip author={post.authorInfo} showRole size={36} />
          <PostMeta post={post} />
        </div>
      </header>

      <div className="mx-auto mt-12 max-w-6xl px-4 sm:px-6">
        <PostCover
          post={post}
          sizes="(min-width: 1152px) 1152px, 100vw"
          priority
          className="aspect-[21/9] rounded-card border border-line"
        />
      </div>

      <div className="mx-auto mt-6 grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <article id={ARTICLE_ID} className="mx-auto w-full max-w-[68ch] lg:mx-0 lg:ml-auto">
          <Content />

          <footer className="mt-20 flex items-center gap-4 rounded-card border border-line bg-card p-6">
            <AuthorAvatar author={post.authorInfo} size={48} />
            <div>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
                Written by
              </p>
              <p className="mt-1 font-medium">{post.authorInfo.name}</p>
              <p className="text-sm text-muted">{post.authorInfo.role}</p>
            </div>
          </footer>
        </article>
        {post.headings.length > 1 && (
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--navbar-height)+3rem)] mt-16">
              <TableOfContents headings={post.headings} />
            </div>
          </aside>
        )}
      </div>

      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 rounded-card border border-line p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <p className="max-w-xl text-lg leading-relaxed text-foreground/90">
            {VALUE_PROPOSITION}
          </p>
          <WaitlistButton className="h-11 shrink-0" />
        </div>
      </section>

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
