export function LogoAnimated({ className }: { className?: string }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <style>{`
          @keyframes logo-screen-cycle {
            0%,  16%, 100% { fill: #1E3A8A; }
            20%            { fill: #1D4ED8; }
            24%            { fill: #1E3A8A; }
            28%            { fill: #1D4ED8; }
            32%            { fill: #1E3A8A; }
            36%            { fill: #1D4ED8; }
            40%            { fill: #1E3A8A; }
            44%            { fill: #1D4ED8; }
            52%            { fill: #1E3A8A; }
            57%            { fill: #1E40AF; }
            73%            { fill: #1E40AF; }
            78%            { fill: #1E3A8A; }
          }
          @keyframes logo-cursor {
            0%   { opacity: 1; }
            7%   { opacity: 0; }
            14%  { opacity: 1; }
            17%  { opacity: 0; }
            79%  { opacity: 0; }
            83%  { opacity: 1; }
            87%  { opacity: 0; }
            93%  { opacity: 1; }
            100% { opacity: 1; }
          }
          @keyframes logo-eq {
            0%, 17% { opacity: 0; }
            20%     { opacity: 1; }
            47%     { opacity: 1; }
            51%     { opacity: 0; }
            100%    { opacity: 0; }
          }
          @keyframes logo-result {
            0%, 53% { opacity: 0; }
            57%     { opacity: 1; }
            72%     { opacity: 1; }
            77%     { opacity: 0; }
            100%    { opacity: 0; }
          }
          @keyframes logo-pb1 {
            0%, 19%, 24%, 100% { fill: #3B82F6; }
            21%                { fill: #BFDBFE; }
          }
          @keyframes logo-pb2 {
            0%, 25%, 30%, 100% { fill: #3B82F6; }
            27%                { fill: #BFDBFE; }
          }
          @keyframes logo-pb3 {
            0%, 31%, 36%, 100% { fill: #3B82F6; }
            33%                { fill: #BFDBFE; }
          }
          @keyframes logo-pb4 {
            0%, 37%, 42%, 100% { fill: #3B82F6; }
            39%                { fill: #BFDBFE; }
          }
          @keyframes logo-pb-eq {
            0%, 49%, 57%, 100% { fill: #F97316; }
            52%                { fill: #FED7AA; }
          }
          .logo-screen { animation: logo-screen-cycle 8s ease infinite; }
          .logo-cursor { fill: #DBEAFE; animation: logo-cursor 8s ease infinite; }
          .logo-t-eq {
            font-family: 'Courier New', Courier, monospace;
            font-weight: 700; font-size: 24px;
            text-anchor: end; dominant-baseline: central;
            fill: #DBEAFE; opacity: 0;
            animation: logo-eq 8s ease infinite;
          }
          .logo-t-result {
            font-family: 'Courier New', Courier, monospace;
            font-weight: 700; font-size: 24px;
            text-anchor: end; dominant-baseline: central;
            fill: #FFFFFF; opacity: 0;
            animation: logo-result 8s ease infinite;
          }
          .logo-b1  { fill: #3B82F6; animation: logo-pb1  8s linear infinite; }
          .logo-b2  { fill: #3B82F6; animation: logo-pb2  8s linear infinite; }
          .logo-b3  { fill: #3B82F6; animation: logo-pb3  8s linear infinite; }
          .logo-b4  { fill: #3B82F6; animation: logo-pb4  8s linear infinite; }
          .logo-beq { fill: #F97316; animation: logo-pb-eq 8s ease   infinite; }
        `}</style>
      </defs>

      {/* Contorno del cuerpo de la calculadora — gris pulido, sin relleno */}
      <rect x="34" y="10" width="132" height="180" rx="16"
        fill="none" stroke="#94A3B8" strokeWidth="3" />

      {/* Screen — x:50→150, y:22→66, portrait and narrow */}
      <rect className="logo-screen" x="50" y="22" width="100" height="44" rx="8" />
      <rect x="51" y="23" width="98" height="1.5" rx="0.75" fill="white" opacity="0.15" />

      {/* Cursor */}
      <rect className="logo-cursor" x="142" y="43" width="6" height="2.5" rx="1.25" />

      {/* Equation & result — right-aligned to x=148, vertically centred on screen */}
      <text className="logo-t-eq"     x="148" y="44">24×7</text>
      <text className="logo-t-result" x="148" y="44">168</text>

      {/* ── Button grid 3 cols × 3 rows, 28×28 square ──
           cols  x = 50,  86, 122   (gap = 8 px)
           rows  y = 76, 112, 148   (gap = 8 px)         */}

      {/* Row 1 — utility (light blue, animated) */}
      <rect className="logo-b1" x="50"  y="76" width="28" height="28" rx="6" />
      <rect className="logo-b2" x="86"  y="76" width="28" height="28" rx="6" />
      <rect className="logo-b3" x="122" y="76" width="28" height="28" rx="6" />

      {/* Row 2 — numbers (medium blue) */}
      <rect className="logo-b4" x="50"  y="112" width="28" height="28" rx="6" />
      <rect x="86"  y="112" width="28" height="28" rx="6" fill="#3B82F6" />
      <rect x="122" y="112" width="28" height="28" rx="6" fill="#3B82F6" />

      {/* Row 3 — numbers + = */}
      <rect x="50"  y="148" width="28" height="28" rx="6" fill="#3B82F6" />
      <rect x="86"  y="148" width="28" height="28" rx="6" fill="#3B82F6" />
      <rect className="logo-beq" x="122" y="148" width="28" height="28" rx="6" />
    </svg>
  );
}
