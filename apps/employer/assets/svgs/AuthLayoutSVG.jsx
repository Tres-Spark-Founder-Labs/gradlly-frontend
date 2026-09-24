export default function AuthLayoutSVG() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 600 800"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bottom-fade" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="var(--color-primary-900)"
            stopOpacity="0"
          />
          <stop
            offset="55%"
            stopColor="var(--color-primary-900)"
            stopOpacity="0.55"
          />
          <stop
            offset="100%"
            stopColor="var(--color-primary-950)"
            stopOpacity="0.95"
          />
        </linearGradient>

        <pattern
          id="dot-grid"
          x="0"
          y="0"
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="2"
            cy="2"
            r="1"
            fill="var(--color-primary-300)"
            opacity="0.09"
          />
        </pattern>
      </defs>

      {/* Base */}
      <rect width="600" height="800" fill="var(--color-primary-900)" />

      {/* Subtle dotted texture */}
      <rect width="600" height="500" fill="url(#dot-grid)" />

      {/* Top right concentric circles */}
      <circle
        cx="520"
        cy="130"
        r="160"
        fill="var(--color-primary-800)"
        opacity="0.45"
      />
      <circle
        cx="520"
        cy="130"
        r="100"
        fill="var(--color-primary-700)"
        opacity="0.3"
      />
      <circle
        cx="520"
        cy="130"
        r="50"
        fill="var(--color-primary-600)"
        opacity="0.35"
      />

      {/* Dot cluster top right */}
      {[310, 330, 350, 370, 390].map((x) =>
        [60, 80, 100].map((y) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="3"
            fill="var(--color-primary-300)"
            opacity="0.18"
          />
        )),
      )}

      {/* Diamond shapes top left */}
      <rect
        x="80"
        y="95"
        width="36"
        height="36"
        rx="4"
        fill="#f5c842"
        opacity="0.16"
        transform="rotate(45 98 113)"
      />
      <rect
        x="124"
        y="95"
        width="26"
        height="26"
        rx="3"
        fill="#f5c842"
        opacity="0.09"
        transform="rotate(45 137 108)"
      />

      {/* Square layered shape mid left */}
      <rect
        x="68"
        y="220"
        width="72"
        height="72"
        rx="6"
        fill="var(--color-primary-400)"
        opacity="0.12"
      />
      <rect
        x="80"
        y="232"
        width="48"
        height="48"
        rx="4"
        fill="var(--color-primary-400)"
        opacity="0.22"
      />

      {/* Plus / crosshair upper mid */}
      <line
        x1="380"
        y1="180"
        x2="380"
        y2="240"
        stroke="var(--color-primary-400)"
        strokeWidth="3"
        opacity="0.18"
      />
      <line
        x1="350"
        y1="210"
        x2="410"
        y2="210"
        stroke="var(--color-primary-400)"
        strokeWidth="3"
        opacity="0.18"
      />

      {/* Wavy flow lines */}
      {[270, 290, 310, 330].map((y, i) => (
        <path
          key={y}
          d={`M-30 ${y} Q120 ${y - 18} 270 ${y} Q420 ${y + 18} 570 ${y} Q720 ${y - 18} 870 ${y}`}
          stroke="var(--color-primary-500)"
          strokeWidth={i === 3 ? 1.5 : 2}
          fill="none"
          opacity="0.22"
        />
      ))}

      {/* Triangles / mountains */}
      <polygon
        points="90,440 130,380 170,440"
        fill="var(--color-primary-400)"
        opacity="0.4"
      />
      <polygon
        points="200,420 228,380 256,420"
        fill="var(--color-primary-500)"
        opacity="0.28"
      />
      <polygon
        points="156,440 196,395 236,440"
        fill="var(--color-primary-400)"
        opacity="0.18"
      />

      {/* Big sparkle / star center */}
      <path
        d="M310 380 L320 408 L348 418 L320 428 L310 456 L300 428 L272 418 L300 408 Z"
        fill="var(--color-primary-50)"
        opacity="0.55"
      />

      {/* Smaller sparkle accents */}
      <g transform="translate(450, 200)" opacity="0.55">
        <path
          d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z"
          fill="#f5c842"
        />
      </g>
      <g transform="translate(150, 170)" opacity="0.45">
        <path
          d="M 0 -5 L 1.5 -1.5 L 5 0 L 1.5 1.5 L 0 5 L -1.5 1.5 L -5 0 L -1.5 -1.5 Z"
          fill="var(--color-primary-200)"
        />
      </g>

      {/* Sun rays element bottom right */}
      <g transform="translate(500, 460)" opacity="0.45">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={Math.sin(rad) * 36}
              y1={-Math.cos(rad) * 36}
              x2={Math.sin(rad) * 56}
              y2={-Math.cos(rad) * 56}
              stroke="#f5c842"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })}
        <circle cx="0" cy="0" r="9" fill="#f5c842" />
      </g>

      {/* Status pill dots */}
      <circle
        cx="220"
        cy="500"
        r="7"
        fill="var(--color-primary-400)"
        opacity="0.6"
      />
      <circle
        cx="244"
        cy="500"
        r="7"
        fill="var(--color-primary-400)"
        opacity="0.25"
      />
      <circle
        cx="268"
        cy="500"
        r="7"
        fill="var(--color-primary-400)"
        opacity="0.25"
      />
      <circle
        cx="292"
        cy="500"
        r="7"
        fill="var(--color-primary-400)"
        opacity="0.25"
      />

      {/* Plant / leaf shape */}
      <path
        d="M380 540 C380 500 420 480 450 500 C480 520 470 570 430 580 C400 588 380 570 380 540Z"
        fill="var(--color-primary-500)"
        opacity="0.28"
      />
      <path
        d="M390 542 C390 515 420 500 442 515"
        stroke="var(--color-primary-400)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />

      {/* Tiny rings */}
      <circle
        cx="120"
        cy="520"
        r="6"
        fill="none"
        stroke="var(--color-primary-300)"
        strokeWidth="2"
        opacity="0.35"
      />
      <circle
        cx="138"
        cy="538"
        r="3.5"
        fill="var(--color-primary-300)"
        opacity="0.22"
      />

      {/* Diagonal accent lines */}
      <line
        x1="500"
        y1="540"
        x2="560"
        y2="580"
        stroke="var(--color-primary-400)"
        strokeWidth="1.5"
        opacity="0.18"
      />
      <line
        x1="520"
        y1="530"
        x2="580"
        y2="570"
        stroke="var(--color-primary-400)"
        strokeWidth="1.5"
        opacity="0.18"
      />
      <line
        x1="540"
        y1="520"
        x2="600"
        y2="560"
        stroke="var(--color-primary-400)"
        strokeWidth="1.5"
        opacity="0.18"
      />

      {/* Drifting particles */}
      <circle
        cx="118"
        cy="142"
        r="3"
        fill="var(--color-primary-300)"
        opacity="0.4"
      />
      <circle
        cx="478"
        cy="378"
        r="3"
        fill="var(--color-primary-300)"
        opacity="0.3"
      />
      <circle
        cx="104"
        cy="356"
        r="2.5"
        fill="var(--color-primary-200)"
        opacity="0.4"
      />
      <circle
        cx="158"
        cy="98"
        r="2"
        fill="var(--color-primary-400)"
        opacity="0.5"
      />
      <circle
        cx="442"
        cy="118"
        r="2.5"
        fill="var(--color-primary-300)"
        opacity="0.32"
      />

      {/* Deep fade so the bottom copy sits on a clean field */}
      <rect width="600" height="800" fill="url(#bottom-fade)" />
    </svg>
  );
}
