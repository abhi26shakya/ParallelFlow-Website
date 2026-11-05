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

// A grid card: cover on top, then tags, title, summary and byline.
export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className={cardClass}>
      <PostCover
        post={post}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="aspect-[16/10] border-b border-line"
      />
      <div className="flex flex-1 flex-col p-6">
        <PostTags tags={post.tags} />
        <div className="mt-4 flex items-start justify-between gap-4">
          <h3 className="text-xl font-medium leading-snug tracking-tight sm:text-2xl">
            {post.title}
          </h3>
          <Arrow />
        </div>
        <p className="mt-3 line-clamp-3 leading-relaxed text-muted">
          {post.summary}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <AuthorChip author={post.authorInfo} />
          <PostMeta post={post} />
        </div>
      </div>
    </Link>
  );
}

// The newest post, wide: cover on the left, text on the right.
export function FeaturedPost({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`${cardClass} md:grid md:grid-cols-12`}
    >
      <PostCover
        post={post}
        sizes="(min-width: 768px) 60vw, 100vw"
        priority
        className="aspect-[16/10] border-b border-line md:col-span-7 md:aspect-auto md:min-h-[26rem] md:border-b-0 md:border-r"
      />
      <div className="flex flex-col p-6 sm:p-8 md:col-span-5 md:p-10">
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
