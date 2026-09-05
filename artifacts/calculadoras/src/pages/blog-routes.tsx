import { lazy, Suspense, type ComponentType } from "react";

/** The blog article page pulls in every article body (~86 KB gzipped of prose)
 * that no calculator page needs, so on the client it is loaded on demand.
 *
 * The prerenderer, however, renders synchronously with renderToString: a
 * Suspense boundary there would emit the fallback and strip the article text
 * out of the published HTML. So the server build calls preload() first and this
 * component then renders the resolved module directly, with no boundary. */
let LoadedArticle: ComponentType | null = null;
let LoadedIndex: ComponentType | null = null;

export async function preloadBlogRoutes(): Promise<void> {
  LoadedArticle = (await import("@/pages/blog-article")).default;
  LoadedIndex = (await import("@/pages/blog")).default;
}

const BlogArticleLazy = lazy(() => import("@/pages/blog-article"));
const BlogIndexLazy = lazy(() => import("@/pages/blog"));

export function BlogArticleRoute() {
  if (LoadedArticle) return <LoadedArticle />;
  return (
    <Suspense fallback={null}>
      <BlogArticleLazy />
    </Suspense>
  );
}

export function BlogIndexRoute() {
  if (LoadedIndex) return <LoadedIndex />;
  return (
    <Suspense fallback={null}>
      <BlogIndexLazy />
    </Suspense>
  );
}
