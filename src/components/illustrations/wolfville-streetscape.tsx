export default function WolfvilleStreetscape({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 400"
      className={className}
      role="img"
      aria-label="Illustration of a Wolfville streetscape with a clocktower hall, a columned library, a rowhouse, and a corner pub"
      preserveAspectRatio="xMidYMax slice"
    >
      {/* distant background shapes */}
      <g opacity="0.55">
        <rect x="-10" y="190" width="70" height="180" fill="var(--card-border)" />
        <polygon points="40,230 100,110 160,230" fill="var(--gold-light)" opacity="0.6" />
        <rect x="352" y="170" width="55" height="190" fill="var(--card-border)" />
        <polygon points="628,150 690,60 752,150" fill="var(--gold-light)" opacity="0.55" />
        <rect x="852" y="180" width="52" height="180" fill="var(--card-border)" />
        <rect x="1048" y="150" width="82" height="210" fill="var(--card-border)" />
        <polygon points="1118,215 1170,130 1212,215" fill="var(--gold-light)" opacity="0.5" />
      </g>

      {/* ground */}
      <rect x="0" y="358" width="1200" height="42" fill="var(--card-border)" opacity="0.7" />

      {/* ===== Library (columned) ===== */}
      <g>
        <polygon
          points="66,220 210,150 354,220"
          fill="var(--gold-light)"
          stroke="var(--garnet-dark)"
          strokeWidth="3"
        />
        <rect x="80" y="220" width="260" height="14" fill="var(--garnet-dark)" />
        {[110, 150, 190, 230, 270, 310].map((x) => (
          <rect key={x} x={x} y="234" width="14" height="116" fill="var(--garnet)" />
        ))}
        <rect x="68" y="350" width="284" height="10" fill="var(--garnet-dark)" />
      </g>

      {/* ===== Rowhouse / rentals building ===== */}
      <g>
        <rect x="660" y="192" width="210" height="10" fill="var(--garnet-dark)" />
        <rect x="670" y="202" width="190" height="158" fill="var(--garnet-light)" stroke="var(--garnet-dark)" strokeWidth="3" />
        {[222, 264, 306].map((y) => (
          <g key={y}>
            {[690, 730, 770, 810].map((x) => (
              <rect key={x} x={x} y={y} width="22" height="26" fill="var(--card)" opacity="0.92" />
            ))}
          </g>
        ))}
        <rect x="750" y="330" width="30" height="30" fill="var(--garnet-dark)" />
      </g>

      {/* ===== University Hall (clocktower) ===== */}
      <g>
        <rect x="410" y="130" width="220" height="10" fill="var(--garnet-dark)" />
        <rect x="420" y="140" width="200" height="220" fill="var(--garnet)" stroke="var(--garnet-dark)" strokeWidth="3" />
        {[165, 205, 245, 285].map((y) => (
          <g key={y}>
            {[440, 478, 516, 554, 592].map((x) => (
              <rect key={x} x={x} y={y} width="16" height="20" fill="var(--gold-light)" opacity="0.9" />
            ))}
          </g>
        ))}
        <rect x="490" y="70" width="60" height="90" fill="var(--garnet-light)" stroke="var(--garnet-dark)" strokeWidth="3" />
        <polygon points="480,70 520,25 560,70" fill="var(--garnet-dark)" />
        <line x1="520" y1="25" x2="520" y2="10" stroke="var(--garnet-dark)" strokeWidth="2" />
        <circle cx="520" cy="10" r="3" fill="var(--gold)" />
        <circle cx="520" cy="108" r="17" fill="var(--gold-light)" stroke="var(--garnet-dark)" strokeWidth="2" />
        <line x1="520" y1="108" x2="520" y2="97" stroke="var(--garnet-dark)" strokeWidth="2" strokeLinecap="round" />
        <line x1="520" y1="108" x2="530" y2="108" stroke="var(--garnet-dark)" strokeWidth="2" strokeLinecap="round" />
        <path d="M498,360 L498,332 a22,22 0 0 1 44,0 L542,360 Z" fill="var(--garnet-dark)" />
      </g>

      {/* ===== Pub / corner shop ===== */}
      <g>
        <polygon points="880,260 970,205 1060,260" fill="var(--garnet)" stroke="var(--garnet-dark)" strokeWidth="3" />
        <rect x="990" y="215" width="16" height="30" fill="var(--garnet-dark)" />
        <rect x="890" y="260" width="160" height="100" fill="var(--gold-light)" stroke="var(--garnet-dark)" strokeWidth="3" />
        <rect x="905" y="290" width="130" height="12" fill="var(--garnet)" />
        <rect x="935" y="268" width="70" height="20" rx="3" fill="var(--card)" stroke="var(--garnet-dark)" strokeWidth="2" />
        <text
          x="970"
          y="283"
          fontSize="11"
          fontWeight="700"
          textAnchor="middle"
          fill="var(--garnet-dark)"
          fontFamily="var(--font-sans, sans-serif)"
        >
          PUB
        </text>
        <rect x="935" y="320" width="30" height="40" fill="var(--garnet-dark)" />
        <rect x="980" y="318" width="34" height="28" fill="var(--card)" stroke="var(--garnet-dark)" strokeWidth="2" />
        <line x1="997" y1="318" x2="997" y2="346" stroke="var(--garnet-dark)" strokeWidth="1.5" />
        <line x1="980" y1="332" x2="1014" y2="332" stroke="var(--garnet-dark)" strokeWidth="1.5" />
      </g>

      {/* street furniture + figures */}
      <g fill="var(--garnet-dark)">
        {/* streetlamps */}
        <rect x="399" y="300" width="4" height="60" />
        <circle cx="401" cy="296" r="6" />
        <rect x="874" y="300" width="4" height="60" />
        <circle cx="876" cy="296" r="6" />

        {/* trees */}
        <g>
          <rect x="627" y="330" width="6" height="30" />
          <circle cx="630" cy="318" r="16" />
        </g>
        <g>
          <rect x="1038" y="332" width="6" height="28" />
          <circle cx="1041" cy="320" r="14" />
        </g>

        {/* person walking */}
        <g>
          <circle cx="30" cy="336" r="6" />
          <path d="M30,343 L24,360 M30,343 L36,360 M30,343 L30,360" stroke="var(--garnet-dark)" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* cyclist */}
        <g stroke="var(--garnet-dark)" strokeWidth="2.5" fill="none">
          <circle cx="1090" cy="352" r="10" />
          <circle cx="1128" cy="352" r="10" />
          <path d="M1090,352 L1104,330 L1118,352 M1104,330 L1104,340 M1092,340 L1116,340" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="1104" cy="326" r="4" fill="var(--garnet-dark)" stroke="none" />
        </g>
      </g>
    </svg>
  );
}
