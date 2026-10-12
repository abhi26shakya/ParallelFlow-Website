import { PRODUCTS } from "@/content/products";

// Arena, Workspace and Developer Space, each marked "Coming soon" with no
// link until its product page exists.
export function ProductCards() {
  return (
    <ul className="mt-12 grid gap-4 lg:grid-cols-3">
      {PRODUCTS.map((product) => (
        <li
          key={product.name}
          className="rounded-card border border-line bg-card p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">{product.name}</h3>
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
