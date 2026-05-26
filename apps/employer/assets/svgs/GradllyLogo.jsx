export function GradllyLogo({ size = 36, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{
        flexShrink: 0,
        filter: "drop-shadow(0 1px 1px rgb(0 0 0 / 0.07))",
      }}
    >
      {/* bg-primary-700 */}
      <rect width="36" height="36" rx="8" fill="#1b4f32" />
      {/* ring-1 ring-primary-700/30 */}
      <rect
        x="0.5"
        y="0.5"
        width="35"
        height="35"
        rx="7.5"
        stroke="#1b4f32"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
      {/* G — text-xl font-bold, visually centred in 36 px square */}
      <text
        x="18"
        y="25"
        fontFamily="Poppins, ui-sans-serif, system-ui, -apple-system, sans-serif"
        fontSize="20"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
      >
        G
      </text>
    </svg>
  );
}
