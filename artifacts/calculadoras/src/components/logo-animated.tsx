export function LogoAnimated({ className }: { className?: string }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="0" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
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
            57%            { fill: #2563EB; }
            73%            { fill: #2563EB; }
            78%            { fill: #1E3A8A; }
          }
          @keyframes logo-cursor {
            0%         { opacity: 1; }
            7%         { opacity: 0; }
            14%        { opacity: 1; }
            17%        { opacity: 0; }
            79%        { opacity: 0; }
            83%        { opacity: 1; }
            87%        { opacity: 0; }
            93%        { opacity: 1; }
            100%       { opacity: 1; }
          }
          @keyframes logo-eq {
            0%, 17%   { opacity: 0; }
            20%        { opacity: 1; }
            47%        { opacity: 1; }
            51%        { opacity: 0; }
            100%       { opacity: 0; }
          }
          @keyframes logo-result {
            0%, 53%   { opacity: 0; }
            57%        { opacity: 1; }
            72%        { opacity: 1; }
            77%        { opacity: 0; }
            100%       { opacity: 0; }
          }
          @keyframes logo-pb1 {
            0%, 19%, 24%, 100% { fill: #3B82F6; }
            21%                { fill: #93C5FD; }
          }
          @keyframes logo-pb2 {
            0%, 25%, 30%, 100% { fill: #3B82F6; }
            27%                { fill: #93C5FD; }
          }
          @keyframes logo-pb3 {
            0%, 31%, 36%, 100% { fill: #3B82F6; }
            33%                { fill: #93C5FD; }
          }
          @keyframes logo-pb4 {
            0%, 37%, 42%, 100% { fill: #3B82F6; }
            39%                { fill: #93C5FD; }
          }
          @keyframes logo-pb-eq {
            0%, 49%, 57%, 100% { fill: #FF6A00; }
            52%                { fill: #FFA040; }
          }
          .logo-screen  { animation: logo-screen-cycle 8s ease infinite; }
          .logo-cursor  { fill: #93C5FD; animation: logo-cursor 8s ease infinite; }
          .logo-t-eq    {
            font-family: 'Courier New', Courier, monospace;
            font-weight: 700; font-size: 11px;
            text-anchor: end; dominant-baseline: middle;
            fill: #93C5FD; opacity: 0;
            animation: logo-eq 8s ease infinite;
          }
          .logo-t-result {
            font-family: 'Courier New', Courier, monospace;
            font-weight: 700; font-size: 11px;
            text-anchor: end; dominant-baseline: middle;
            fill: #DBEAFE; opacity: 0;
            animation: logo-result 8s ease infinite;
          }
          .logo-b1  { animation: logo-pb1  8s linear infinite; }
          .logo-b2  { animation: logo-pb2  8s linear infinite; }
          .logo-b3  { animation: logo-pb3  8s linear infinite; }
          .logo-b4  { animation: logo-pb4  8s linear infinite; }
          .logo-beq { animation: logo-pb-eq 8s ease   infinite; }
        `}</style>
      </defs>

      {/* Background */}
      <rect width="180" height="180" rx="40" fill="url(#logo-bg)" />

      {/* Calculator body */}
      <rect x="48" y="32" width="84" height="116" rx="16" fill="#FFFFFF" />

      {/* Screen */}
      <rect className="logo-screen" x="62" y="46" width="56" height="26" rx="6" />

      {/* Blinking cursor */}
      <rect className="logo-cursor" x="107" y="64" width="6" height="2" rx="1" />

      {/* Equation text */}
      <text className="logo-t-eq" x="113" y="59">24×7</text>

      {/* Result text */}
      <text className="logo-t-result" x="113" y="59">168</text>

      {/* Buttons row 1 */}
      <circle className="logo-b1" cx="68"  cy="92" r="7" />
      <circle className="logo-b2" cx="90"  cy="92" r="7" />
      <circle className="logo-b3" cx="112" cy="92" r="7" />

      {/* Buttons row 2 */}
      <circle className="logo-b4" cx="68"  cy="118" r="7" />
      <circle cx="90" cy="118" r="7" fill="#3B82F6" />
      <circle className="logo-beq" cx="112" cy="118" r="7" />
    </svg>
  );
}
