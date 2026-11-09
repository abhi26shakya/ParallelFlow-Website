// Blog authors: real ParallelFlow team members only. The owner adds people
// here; a post's `author` must match one of these ids or the build fails.
// See README.md in this folder.

export type Author = {
  name: string;
  // e.g. "Co-founder" or "Engineering".
  role: string;
  // Square image under public/blog/authors/, e.g. "/blog/authors/jane.jpg".
  // Without one, the author's initials are shown.
  avatar?: string;
};

// Keyed by author id, e.g. { jane: { name: "Jane Doe", role: "Co-founder" } }.
export const AUTHORS: Record<string, Author> = {
  kirankant: { name: "KiranKant", role: "Co-founder" },
  abhishek: { name: "Abhishek Singh", role: "Co-founder" },
};
