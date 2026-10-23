import { useEffect, useRef } from "react";
import { adsAllowed } from "@/lib/ads";

interface AdUnitProps {
  /** Monetag banner script URL (from AD_SLOTS). Empty renders nothing. */
  slot: string;
  className?: string;
}

export function AdUnit({ slot, className }: AdUnitProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !slot || !adsAllowed()) return;
    // Monetag's banner tag renders where its script sits, so it goes inside
    // the slot. Cleared on unmount so client-side navigation doesn't stack ads.
    const script = document.createElement("script");
    script.src = slot;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    el.appendChild(script);
    return () => {
      el.innerHTML = "";
    };
  }, [slot]);

  if (!slot) return null;
  return <div ref={ref} className={className} />;
}
