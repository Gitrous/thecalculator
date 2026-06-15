import { useState, useRef, useEffect } from "react";
import { Triangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

type Mode = "hipotenusa" | "cateto";

function fmt(n: number): string {
  return n.toLocaleString("es-ES", { maximumFractionDigits: 4 });
}

// ── SVG triangle visualization ──────────────────────────────────────────────

interface TriangleVizProps {
  a: number | null;
  b: number | null;
  c: number | null;
  calculated: "a" | "b" | "c" | null;
}

function Badge({
  cx, cy, text, bg, textColor,
}: { cx: number; cy: number; text: string; bg: string; textColor: string }) {
  const w = Math.max(text.length * 7.2 + 16, 48);
  const h = 22;
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="11" fill={bg} />
      <text
        x={cx} y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fontWeight="600"
        fill={textColor}
      >
        {text}
      </text>
    </g>
  );
}

function AngleArc({
  vx, vy, d1x, d1y, d2x, d2y, r, color, label,
}: {
  vx: number; vy: number;
  d1x: number; d1y: number;
  d2x: number; d2y: number;
  r: number; color: string; label: string;
}) {
  const sx = vx + d1x * r, sy = vy + d1y * r;
  const ex = vx + d2x * r, ey = vy + d2y * r;
  // cross product to determine sweep direction
  const cross = d1x * d2y - d1y * d2x;
  const sweep = cross < 0 ? 1 : 0;
  const lx = vx + (d1x + d2x) * r * 0.85;
  const ly = vy + (d1y + d2y) * r * 0.85;
  return (
    <g>
      <path
        d={`M ${sx} ${sy} A ${r} ${r} 0 0 ${sweep} ${ex} ${ey}`}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.7"
      />
      <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill={color} opacity="0.9">
        {label}
      </text>
    </g>
  );
}

function TriangleViz({ a, b, c, calculated }: TriangleVizProps) {
  const W = 320, H = 260;
  const PAD = 64;

  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const pinch = useRef<{ dist: number; cx: number; cy: number } | null>(null);

  // Non-passive wheel listener so we can preventDefault and avoid page scroll
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.85 : 1.18;
      const rect = svg.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width * W;
      const cy = (e.clientY - rect.top) / rect.height * H;
      setView(v => {
        const ns = Math.max(0.3, Math.min(8, v.scale * factor));
        return {
          scale: ns,
          x: cx - (cx - v.x) * (ns / v.scale),
          y: cy - (cy - v.y) * (ns / v.scale),
        };
      });
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [W, H]);

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const rect = svgRef.current!.getBoundingClientRect();
    const dx = (e.clientX - lastMouse.current.x) / rect.width * W;
    const dy = (e.clientY - lastMouse.current.y) / rect.height * H;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    setView(v => ({ ...v, x: v.x + dx, y: v.y + dy }));
  };

  const onMouseUp = () => setDragging(false);

  function touchDist(t: React.TouchList) {
    const dx = t[0].clientX - t[1].clientX;
    const dy = t[0].clientY - t[1].clientY;
    return Math.hypot(dx, dy);
  }

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setDragging(false);
      const rect = svgRef.current!.getBoundingClientRect();
      const cx = ((e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left) / rect.width * W;
      const cy = ((e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top) / rect.height * H;
      pinch.current = { dist: touchDist(e.touches), cx, cy };
    } else if (e.touches.length === 1) {
      pinch.current = null;
      setDragging(true);
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    if (e.touches.length === 2 && pinch.current) {
      e.preventDefault();
      const { dist, cx, cy } = pinch.current;
      const factor = touchDist(e.touches) / dist;
      setView(v => {
        const ns = Math.max(0.3, Math.min(8, v.scale * factor));
        return {
          scale: ns,
          x: cx - (cx - v.x) * (ns / v.scale),
          y: cy - (cy - v.y) * (ns / v.scale),
        };
      });
      pinch.current = { dist: touchDist(e.touches), cx, cy };
    } else if (e.touches.length === 1 && dragging) {
      e.preventDefault();
      const dx = (e.touches[0].clientX - lastMouse.current.x) / rect.width * W;
      const dy = (e.touches[0].clientY - lastMouse.current.y) / rect.height * H;
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setView(v => ({ ...v, x: v.x + dx, y: v.y + dy }));
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setDragging(false);
      pinch.current = null;
    } else if (e.touches.length === 1) {
      pinch.current = null;
      setDragging(true);
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const ra = a ?? 3;
  const rb = b ?? 4;

  const maxW = W - PAD * 2;
  const maxH = H - PAD * 2;
  const scale = Math.min(maxW / rb, maxH / ra);

  const sa = ra * scale;
  const sb = rb * scale;
  const sc = Math.sqrt(sa * sa + sb * sb);

  // Vertices
  const ox = PAD,     oy = H - PAD;   // right-angle
  const tx = ox,      ty = oy - sa;   // top
  const rx = ox + sb, ry = oy;        // right

  const GREEN  = "#0FA958";
  const BLUE   = "#3b82f6";
  const ORANGE = "#f59e0b";
  const MUTED  = "#d1d5db";

  const colors: Record<"a"|"b"|"c", string> = {
    a: calculated === "a" ? GREEN  : a !== null ? BLUE   : MUTED,
    b: calculated === "b" ? GREEN  : b !== null ? ORANGE : MUTED,
    c: calculated === "c" ? GREEN  : c !== null ? "#8b5cf6" : MUTED,
  };

  function sideLabel(side: "a"|"b"|"c") {
    const val = { a, b, c }[side];
    return val !== null ? `${side} = ${fmt(val)}` : `${side} = ?`;
  }

  const SQ = 13;

  // Label positions
  const badgeA = { cx: ox - 38, cy: (oy + ty) / 2 };
  const badgeB = { cx: (ox + rx) / 2, cy: oy + 28 };
  // hypotenuse midpoint + perpendicular offset outward
  const hypMidX = (tx + rx) / 2, hypMidY = (ty + ry) / 2;
  const perpX = sa / sc, perpY = -sb / sc; // unit normal pointing right
  const badgeC = { cx: hypMidX + perpX * 32, cy: hypMidY + perpY * 32 };

  // Angles at top and right vertices (only when triangle is complete)
  const complete = a !== null && b !== null;
  const angTop   = complete ? Math.round(Math.atan2(rb, ra) * 180 / Math.PI) : null;
  const angRight = complete ? Math.round(Math.atan2(ra, rb) * 180 / Math.PI) : null;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-full select-none"
      style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
      aria-label="Triángulo rectángulo"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Reset button */}
      <g
        onClick={() => setView({ x: 0, y: 0, scale: 1 })}
        style={{ cursor: "pointer" }}
      >
        <rect x={W - 36} y={4} width={32} height={18} rx="5" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
        <text x={W - 20} y={13} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#6b7280">↺ reset</text>
      </g>

      <g transform={`translate(${view.x}, ${view.y}) scale(${view.scale})`}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Fill */}
      <polygon
        points={`${ox},${oy} ${tx},${ty} ${rx},${ry}`}
        fill="#0FA958"
        opacity="0.08"
      />

      {/* Right-angle square */}
      <path
        d={`M ${ox},${oy - SQ} L ${ox + SQ},${oy - SQ} L ${ox + SQ},${oy}`}
        fill="none"
        stroke="#6b7280"
        strokeWidth="1.5"
      />
      <text x={ox + SQ / 2} y={oy - SQ / 2} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#9ca3af">90°</text>

      {/* Angle arcs */}
      {angTop !== null && (
        <AngleArc
          vx={tx} vy={ty}
          d1x={0} d1y={1}
          d2x={sb / sc} d2y={sa / sc}
          r={18} color="#6b7280" label={`${angTop}°`}
        />
      )}
      {angRight !== null && (
        <AngleArc
          vx={rx} vy={ry}
          d1x={-sb / sc} d1y={-sa / sc}
          d2x={-1} d2y={0}
          r={18} color="#6b7280" label={`${angRight}°`}
        />
      )}

      {/* Cateto a */}
      <line x1={ox} y1={oy} x2={tx} y2={ty}
        stroke={colors.a} strokeWidth={calculated === "a" ? 4 : 3}
        strokeLinecap="round"
        filter={calculated === "a" ? "url(#glow)" : undefined}
      />

      {/* Cateto b */}
      <line x1={ox} y1={oy} x2={rx} y2={ry}
        stroke={colors.b} strokeWidth={calculated === "b" ? 4 : 3}
        strokeLinecap="round"
        filter={calculated === "b" ? "url(#glow)" : undefined}
      />

      {/* Hypotenuse c */}
      <line x1={tx} y1={ty} x2={rx} y2={ry}
        stroke={colors.c} strokeWidth={calculated === "c" ? 4 : 3}
        strokeLinecap="round"
        strokeDasharray={c === null && calculated !== "c" ? "7 4" : undefined}
        filter={calculated === "c" ? "url(#glow)" : undefined}
      />

      {/* Vertex dots */}
      {([
        [ox, oy], [tx, ty], [rx, ry],
      ] as [number, number][]).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#6b7280" strokeWidth="1.5" />
      ))}

      {/* Badges */}
      <Badge cx={badgeA.cx} cy={badgeA.cy} text={sideLabel("a")}
        bg={colors.a} textColor="white" />
      <Badge cx={badgeB.cx} cy={badgeB.cy} text={sideLabel("b")}
        bg={colors.b} textColor="white" />
      <Badge cx={badgeC.cx} cy={badgeC.cy} text={sideLabel("c")}
        bg={colors.c} textColor="white" />
      </g>
    </svg>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

const T = {
  es: {
    title: "Calculadora de Pitágoras",
    subtitle: "Calcula la hipotenusa o un cateto de un triángulo rectángulo. El simulador se actualiza en tiempo real conforme introduces los valores.",
    cardTitle: "¿Qué quieres calcular?",
    hypBtn: "Hipotenusa (c)",
    legBtn: "Cateto (b)",
    legA: "Cateto a",
    legB: "Cateto b",
    hyp: "Hipotenusa c",
    hypResult: "Hipotenusa (c)",
    legResult: "Cateto (b)",
    invalidWarning: "⚠️ La hipotenusa debe ser mayor que el cateto.",
    enterValues: "Introduce los valores para calcular.",
    simTitle: "Simulador",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Qué es el teorema de Pitágoras?",
    a1: "El teorema de Pitágoras establece que en todo triángulo rectángulo la suma de los cuadrados de los catetos es igual al cuadrado de la hipotenusa: a² + b² = c². Fue demostrado por el matemático griego Pitágoras en el siglo VI a.C.",
    q2: "¿Qué es la hipotenusa y qué son los catetos?",
    a2: "La hipotenusa (c) es el lado más largo del triángulo rectángulo y es el opuesto al ángulo recto. Los catetos (a y b) son los dos lados que forman el ángulo recto.",
    q3: "¿Cuál es la terna pitagórica más conocida?",
    a3: "La terna 3-4-5 es la más famosa: 3² + 4² = 9 + 16 = 25 = 5². Otras ternas conocidas son 5-12-13, 8-15-17 y 7-24-25.",
  },
  en: {
    title: "Pythagorean Theorem Calculator",
    subtitle: "Calculate the hypotenuse or a leg of a right triangle. The simulator updates in real time as you enter values.",
    cardTitle: "What do you want to calculate?",
    hypBtn: "Hypotenuse (c)",
    legBtn: "Leg (b)",
    legA: "Leg a",
    legB: "Leg b",
    hyp: "Hypotenuse c",
    hypResult: "Hypotenuse (c)",
    legResult: "Leg (b)",
    invalidWarning: "⚠️ The hypotenuse must be greater than the leg.",
    enterValues: "Enter values to calculate.",
    simTitle: "Simulator",
    faqTitle: "Frequently asked questions",
    q1: "What is the Pythagorean theorem?",
    a1: "The Pythagorean theorem states that in every right triangle, the sum of the squares of the two legs equals the square of the hypotenuse: a² + b² = c². It was proved by the Greek mathematician Pythagoras in the 6th century BC.",
    q2: "What are the hypotenuse and legs?",
    a2: "The hypotenuse (c) is the longest side of a right triangle and is opposite the right angle. The legs (a and b) are the two sides that form the right angle.",
    q3: "What is the most famous Pythagorean triple?",
    a3: "The 3-4-5 triple is the most famous: 3² + 4² = 9 + 16 = 25 = 5². Other well-known triples are 5-12-13, 8-15-17 and 7-24-25.",
  },
};

export default function Pitagoras() {
  const locale = useLocale();
  const t = T[locale];

  const [mode, setMode] = useState<Mode>("hipotenusa");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");

  const A = parseFloat(a);
  const B = parseFloat(b);
  const C = parseFloat(c);

  let result: number | null = null;
  let formula = "";
  let calculated: "a" | "b" | "c" | null = null;

  if (mode === "hipotenusa") {
    if (!isNaN(A) && !isNaN(B) && A > 0 && B > 0) {
      result = Math.sqrt(A * A + B * B);
      formula = `c = √(a² + b²) = √(${fmt(A)}² + ${fmt(B)}²)`;
      calculated = "c";
    }
  } else {
    if (!isNaN(C) && !isNaN(A) && C > 0 && A > 0 && C > A) {
      result = Math.sqrt(C * C - A * A);
      formula = `b = √(c² − a²) = √(${fmt(C)}² − ${fmt(A)}²)`;
      calculated = "b";
    }
  }

  // Values to pass to the triangle (including the computed one)
  const vizA = !isNaN(A) && A > 0 ? A : null;
  const vizB = mode === "hipotenusa"
    ? (!isNaN(B) && B > 0 ? B : null)
    : (result !== null ? result : null);
  const vizC = mode === "cateto"
    ? (!isNaN(C) && C > 0 ? C : null)
    : (result !== null ? result : null);

  const invalidCateto = mode === "cateto" && !isNaN(C) && !isNaN(A) && C > 0 && A > 0 && C <= A;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Triangle className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-8">{t.subtitle}</p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* ── Inputs ── */}
        <Card>
          <CardHeader>
            <CardTitle>{t.cardTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-6">
              <Button
                variant={mode === "hipotenusa" ? "default" : "outline"}
                onClick={() => { setMode("hipotenusa"); setC(""); }}
              >
                {t.hypBtn}
              </Button>
              <Button
                variant={mode === "cateto" ? "default" : "outline"}
                onClick={() => { setMode("cateto"); setB(""); }}
              >
                {t.legBtn}
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="a">{t.legA}</Label>
                <Input
                  id="a"
                  type="number"
                  min="0"
                  placeholder="ej. 3"
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  className="mt-1"
                />
              </div>

              {mode === "hipotenusa" ? (
                <div>
                  <Label htmlFor="b">{t.legB}</Label>
                  <Input
                    id="b"
                    type="number"
                    min="0"
                    placeholder="ej. 4"
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    className="mt-1"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="c">{t.hyp}</Label>
                  <Input
                    id="c"
                    type="number"
                    min="0"
                    placeholder="ej. 5"
                    value={c}
                    onChange={(e) => setC(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            {result !== null ? (
              <div className="mt-6 rounded-lg bg-primary/5 border border-primary/20 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">{formula}</p>
                <p className="text-3xl font-bold text-primary">{fmt(result)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {mode === "hipotenusa" ? t.hypResult : t.legResult}
                </p>
              </div>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground text-center">
                {invalidCateto ? t.invalidWarning : t.enterValues}
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Triangle visualization ── */}
        <Card>
          <CardHeader>
            <CardTitle>{t.simTitle}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[260px]">
            <TriangleViz
              a={vizA}
              b={vizB}
              c={vizC}
              calculated={calculated}
            />
          </CardContent>
        </Card>
      </div>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <section>
        <h2 className="text-xl font-semibold mb-4">{t.faqTitle}</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>{t.q1}</AccordionTrigger>
            <AccordionContent>{t.a1}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>{t.q2}</AccordionTrigger>
            <AccordionContent>{t.a2}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>{t.q3}</AccordionTrigger>
            <AccordionContent>{t.a3}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
