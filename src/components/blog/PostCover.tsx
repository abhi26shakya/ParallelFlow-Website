import Image from "next/image";
import type { Post } from "@/lib/blog";
import { BlogCover } from "./BlogCover";

// A post's cover image, or its generated cover when it has none. Zooms
// slightly when the surrounding `group` (the card link) is hovered.
export function PostCover({
  post,
  sizes,
  priority = false,
  className = "",
}: {
  post: Post;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const zoom =
    "transition-transform duration-700 ease-out group-hover:scale-[1.03]";
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {post.cover ? (
        <Image
          src={post.cover}
          alt={post.coverAlt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${zoom}`}
        />
      ) : (
        <BlogCover
          seed={post.slug}
          label={post.tags[0]}
          className={`absolute inset-0 ${zoom}`}
        />
      )}
    </div>
  );
}
