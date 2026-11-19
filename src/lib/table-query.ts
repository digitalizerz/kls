export const PAGE_SIZES = [10, 25, 50] as const;

export function parsePage(value?: string) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function parsePageSize(value?: string) {
  const size = Number(value);
  return PAGE_SIZES.includes(size as (typeof PAGE_SIZES)[number]) ? size : 25;
}

export function pickSort<T extends string>(value: string | undefined, allowed: readonly T[]) {
  return allowed.includes(value as T) ? (value as T) : undefined;
}

export function parseDir(value: string | undefined, fallback: "asc" | "desc" = "asc") {
  if (value === "asc" || value === "desc") return value;
  return fallback;
}

export function pageWindow(page: number, pageSize: number, total: number) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(page, 1), pages);
  const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);
  return { page: current, pages, pageSize, start, end, skip: (current - 1) * pageSize, total };
}

export function compactParams(entries: Record<string, string | undefined | null>) {
  const params: Record<string, string> = {};
  for (const [key, value] of Object.entries(entries)) {
    if (value) params[key] = value;
  }
  return params;
}

export function withParams(
  pathname: string,
  current: Record<string, string | undefined | null>,
  patch: Record<string, string | undefined | null> = {},
) {
  const merged = compactParams(current);
  for (const [key, value] of Object.entries(patch)) {
    if (!value) delete merged[key];
    else merged[key] = value;
  }
  const query = new URLSearchParams(merged).toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function sortHref(
  pathname: string,
  current: Record<string, string | undefined>,
  column: string,
  active: string | undefined,
  dir: "asc" | "desc",
  defaultDir: "asc" | "desc" = "asc",
) {
  const nextDir = active === column ? (dir === "asc" ? "desc" : "asc") : defaultDir;
  return withParams(pathname, current, { sort: column, dir: nextDir, page: null });
}

export function pageHref(pathname: string, current: Record<string, string | undefined>, page: number) {
  return withParams(pathname, current, { page: page <= 1 ? null : String(page) });
}

export function pageRedirect(
  pathname: string,
  current: Record<string, string | undefined>,
  requested: number,
  resolved: number,
) {
  if (requested === resolved) return null;
  return pageHref(pathname, current, resolved);
}

export function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export function dayBounds(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const start = new Date(`${value}T00:00:00`);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { gte: start, lt: end };
}

export function oneOf<T extends string>(value: string | undefined, allowed: readonly T[]) {
  return allowed.includes(value as T) ? (value as T) : undefined;
}
