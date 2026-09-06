import { useLocale } from "@/lib/locale";

interface Source {
  /** Visible label, e.g. "Seguridad Social". */
  label: string;
  href: string;
}

interface ReviewedNoteProps {
  /** Date the page's legal or fiscal parameters were last checked against the
   * sources below, as dd/mm/yyyy. Only bump it when the check actually happens. */
  date: string;
  sources: Source[];
  /** What the date and the sources actually cover, when they do not cover the
   * whole page. Use it on calculators that also serve data we have not
   * verified — other countries, market estimates — so the note cannot be read
   * as vouching for them. */
  scope?: string;
  className?: string;
}

/** Provenance line for calculators whose result depends on legislation: when the
 * parameters were last reviewed and against which official sources. */
export function ReviewedNote({ date, sources, scope, className }: ReviewedNoteProps) {
  const locale = useLocale();
  const isEn = locale === "en";
  return (
    <p className={`text-xs text-muted-foreground ${className ?? ""}`}>
      {isEn ? "Parameters last reviewed on " : "Última revisión de los datos: "}
      {date}
      {" · "}
      {isEn ? "Sources: " : "Fuentes: "}
      {sources.map((s, i) => (
        <span key={s.href}>
          {i > 0 && ", "}
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            {s.label}
          </a>
        </span>
      ))}
      {scope ? <span className="block mt-1">{scope}</span> : null}
    </p>
  );
}
