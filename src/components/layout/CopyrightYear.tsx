import { cacheLife } from "next/cache";

// With Cache Components enabled, reading the current date during prerender
// fails the build unless it happens inside a cache scope.
export async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
