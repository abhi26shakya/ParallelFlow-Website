import Link from "next/link";
import { PRODUCTS, type ProductSlug } from "@/content/products";

// Arena, Workspace and Developer Space, each still marked "Coming soon" and
// linking to its section on the Product page. `exclude` hides the current product.
export function ProductCards({ exclude }: { exclude?: ProductSlug }) {
  const products = PRODUCTS.filter((product) => product.slug !== exclude);
  return (
    <ul
      className={`mt-12 grid gap-4 ${products.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}
    >
      {products.map((product) => (
        <li
          key={product.slug}
          className="relative rounded-card border border-line bg-card p-6 transition-colors hover:bg-hover"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">
              {/* The ::after overlay makes the whole card clickable. */}
              <Link
                href={product.href}
                className="after:absolute after:inset-0 after:rounded-card"
              >
                {product.name}
              </Link>
            </h3>
            <span className="shrink-0 rounded-pill border border-line px-3 py-1 text-xs text-muted">
              Coming soon
            </span>
          </div>
          <p className="mt-1 text-sm font-medium">{product.role}</p>
          <p className="mt-4 text-muted">{product.body}</p>
        </li>
      ))}
    </ul>
  );
}
