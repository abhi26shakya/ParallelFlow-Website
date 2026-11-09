import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { formatPostDate, type Post } from "@/lib/blog";
import { AuthorChip } from "./AuthorChip";
import { PostCover } from "./PostCover";

// Date and reading time, in the mono technical style.
export function PostMeta({ post }: { post: Post }) {
  return (
    <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      <span aria-hidden="true" className="mx-2">
        ·
      </span>
      {post.readingMinutes} min read
    </p>
  );
}

export function PostTags({
  tags,
  className = "",
}: {
  tags: string[];
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-pill border border-line px-2.5 py-0.5 text-xs text-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

const cardClass =
  "group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-background transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-foreground/30 hover:shadow-window focus-visible:-translate-y-1";

function Arrow() {
  return (
    <ArrowUpRight
      aria-hidden="true"
      className="size-5 shrink-0 -translate-x-1 translate-y-1 text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-foreground group-hover:opacity-100"
    />
  );
}

// A grid card: cover on top, then tags, title, summary and byline. `wide`
// is for a card alone on its row (owner request, 2026-11-09): from lg up it
// spans the full width with the text on the left and the cover on the
// right, mirroring the featured post above it, so the rows alternate instead
// of leaving an empty gap beside a lone card.
export function PostCard({ post, wide = false }: { post: Post; wide?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`${cardClass} ${wide ? "lg:grid lg:grid-cols-12" : ""}`}
    >
      <PostCover
        post={post}
        sizes={
          wide
            ? "(min-width: 1024px) 60vw, 100vw"
            : "(min-width: 1024px) 60vw, (min-width: 768px) 50vw, 100vw"
        }
        className={`aspect-[16/10] border-b border-line ${
          wide
            ? "lg:order-2 lg:col-span-7 lg:aspect-auto lg:min-h-[26rem] lg:border-b-0 lg:border-l"
            : ""
        }`}
      />
      <div
        className={`flex flex-1 flex-col p-6 ${
          wide ? "sm:p-8 lg:order-1 lg:col-span-5 lg:p-10" : ""
        }`}
      >
        <PostTags tags={post.tags} />
        <div className={`flex items-start justify-between gap-4 ${wide ? "mt-5" : "mt-4"}`}>
          <h3
            className={`font-medium tracking-tight ${
              wide
                ? "text-3xl leading-[1.1] tracking-[-0.02em] sm:text-4xl"
                : "text-xl leading-snug sm:text-2xl"
            }`}
          >
            {post.title}
          </h3>
          <Arrow />
        </div>
        <p
          className={`leading-relaxed text-muted ${
            wide ? "mt-5 text-lg" : "mt-3 line-clamp-3"
          }`}
        >
          {post.summary}
        </p>
        <div
          className={`mt-auto flex flex-wrap items-center justify-between gap-3 ${
            wide ? "pt-8 lg:pt-10" : "pt-6"
          }`}
        >
          <AuthorChip author={post.authorInfo} showRole={wide} />
          <PostMeta post={post} />
        </div>
      </div>
    </Link>
  );
}

// The newest post, wide: cover on the left, text on the right from lg up;
// stacked on phones and tablets so the text column never gets too narrow.
export function FeaturedPost({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`${cardClass} lg:grid lg:grid-cols-12`}
    >
      <PostCover
        post={post}
        sizes="(min-width: 1024px) 60vw, 100vw"
        priority
        className="aspect-[16/10] border-b border-line lg:col-span-7 lg:aspect-auto lg:min-h-[26rem] lg:border-b-0 lg:border-r"
      />
      <div className="flex flex-col p-6 sm:p-8 lg:col-span-5 lg:p-10">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-foreground">
          Latest
        </p>
        <div className="mt-6">
          <PostTags tags={post.tags} />
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-4xl">
            {post.title}
          </h2>
          <Arrow />
        </div>
        <p className="mt-5 text-lg leading-relaxed text-muted">{post.summary}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-10">
          <AuthorChip author={post.authorInfo} showRole />
          <PostMeta post={post} />
        </div>
      </div>
    </Link>
  );
}
