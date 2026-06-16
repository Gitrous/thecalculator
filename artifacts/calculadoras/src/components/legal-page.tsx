import React from "react";
import { Seo } from "@/components/seo";

interface LegalPageProps {
  title: string;
  description: string;
  /** Path beginning with "/", e.g. "/privacidad". */
  path: string;
  /** Equivalent path in the other locale (hreflang). */
  alternatePath: string;
  /** "Última actualización …" / "Last updated …". */
  updated: string;
  children: React.ReactNode;
}

/**
 * Shared shell for the static legal pages (privacy, cookies, legal notice,
 * contact). Centralises the SEO tags and the prose styling so each page only
 * has to provide its content.
 */
export function LegalPage({ title, description, path, alternatePath, updated, children }: LegalPageProps) {
  return (
    <>
      <Seo title={title} description={description} path={path} alternatePath={alternatePath} />
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{updated}</p>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:dark:text-gray-100 [&_h2]:mt-8 [&_h2]:mb-3 [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
          {children}
        </div>
      </article>
    </>
  );
}
