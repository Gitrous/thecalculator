import { useEffect, useRef } from "react";
import { AD_CLIENT } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

interface AdUnitProps {
  slot: string;
  className?: string;
}

export function AdUnit({ slot, className }: AdUnitProps) {
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Skip if this <ins> was already processed by AdSense.
    if (el.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle script not yet loaded; auto-ads will handle it.
    }
  }, []);

  // Don't render anything until AdSense approves the account.
  // The <ins> element is harmless when slot is a placeholder.
  return (
    <div className={className}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
