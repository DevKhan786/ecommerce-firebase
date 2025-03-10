// next.d.ts (new file)
declare module "next" {
  interface PageProps {
    params?: Record<string, string>;
    searchParams?: Record<string, string | string[]>;
  }
}
