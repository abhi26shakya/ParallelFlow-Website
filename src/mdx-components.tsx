import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";

// Styles for blog post bodies (src/content/blog/posts). Required by @next/mdx
// in the App Router. Headings get their ids from rehype-slug.

function MdxLink({ href = "", ...props }: ComponentProps<"a">) {
  const className =
    "font-medium text-foreground underline decoration-line underline-offset-4 transition-colors hover:decoration-foreground";
  if (href.startsWith("/") || href.startsWith("#")) {
    return <Link href={href} className={className} {...props} />;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    />
  );
}

function MdxImage({ src, alt = "" }: ComponentProps<"img">) {
  if (typeof src !== "string") return null;
  return (
    <span className="my-10 block overflow-hidden rounded-card border border-line">
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={900}
        sizes="(min-width: 768px) 720px, 100vw"
        className="h-auto w-full"
      />
    </span>
  );
}

const components: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-16 scroll-mt-28 text-2xl font-medium tracking-tight sm:text-3xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-10 scroll-mt-28 text-xl font-medium tracking-tight"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mt-6 text-lg leading-[1.8] text-foreground/85" {...props} />
  ),
  a: MdxLink,
  // GFM task lists ("- [ ] item") arrive with the class contains-task-list:
  // no bullets, and an outlined, read-only checkbox in place of each marker.
  // The class is merged, not spread over ours, so the list keeps its styling.
  ul: ({ className = "", ...props }) => (
    <ul
      className={`mt-6 space-y-2 text-lg leading-[1.8] text-foreground/85 ${
        className.includes("contains-task-list")
          ? "list-none pl-1 [&_input]:mr-3 [&_input]:size-4 [&_input]:shrink-0 [&_input]:appearance-none [&_input]:rounded-[4px] [&_input]:border [&_input]:border-muted [&_input]:align-[-2px]"
          : "list-disc pl-6 marker:text-muted"
      } ${className}`}
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mt-6 list-decimal space-y-2 pl-6 text-lg leading-[1.8] text-foreground/85 marker:font-mono marker:text-sm marker:text-muted"
      {...props}
    />
  ),
  strong: (props) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-12 border-l-2 border-foreground pl-6 text-2xl font-medium leading-snug tracking-tight text-foreground [&>p]:mt-0 [&>p]:text-[inherit] [&>p]:leading-[inherit] [&>p]:text-foreground"
      {...props}
    />
  ),
  // Inline code. Code blocks are styled through `pre` below.
  code: (props) => (
    <code
      className="rounded-md border border-line bg-card px-1.5 py-0.5 font-mono text-[0.85em] [pre_&]:border-0 [pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:text-sm"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-8 overflow-x-auto rounded-card border border-line bg-card p-5 font-mono text-sm leading-relaxed"
      {...props}
    />
  ),
  hr: () => (
    <div
      role="separator"
      className="my-14 text-center font-mono tracking-[1em] text-muted"
    >
      ···
    </div>
  ),
  table: (props) => (
    // Wide tables scroll sideways inside this box on small screens; the
    // first column (the row labels) stays pinned while they do.
    <div className="my-8 overflow-x-auto rounded-card border border-line">
      <table
        className="w-full min-w-[36rem] border-collapse text-left text-sm sm:min-w-[40rem] sm:text-base [&_tr>:first-child]:sticky [&_tr>:first-child]:left-0 [&_tr>:first-child]:z-10 [&_tr>:first-child]:border-r [&_tr>:first-child]:border-line [&_td:first-child]:bg-background"
        {...props}
      />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-line bg-card px-4 py-3 font-mono text-xs uppercase tracking-widest text-muted"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border-b border-line px-4 py-3 text-foreground/85" {...props} />
  ),
  img: MdxImage,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
