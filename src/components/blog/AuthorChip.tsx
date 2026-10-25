import Image from "next/image";
import type { Author } from "@/content/blog/authors";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AuthorAvatar({
  author,
  size = 28,
}: {
  author: Author;
  size?: number;
}) {
  if (author.avatar) {
    return (
      <Image
        src={author.avatar}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-full border border-line object-cover grayscale"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full border border-line bg-hover font-mono text-[0.65rem] text-foreground"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials(author.name)}
    </span>
  );
}

// Avatar, name and (optionally) role, shown on cards and post pages.
export function AuthorChip({
  author,
  showRole = false,
  size,
}: {
  author: Author;
  showRole?: boolean;
  size?: number;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <AuthorAvatar author={author} size={size} />
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-medium text-foreground">{author.name}</span>
        {showRole && <span className="text-xs text-muted">{author.role}</span>}
      </span>
    </span>
  );
}
