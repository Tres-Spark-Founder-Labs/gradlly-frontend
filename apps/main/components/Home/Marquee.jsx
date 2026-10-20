const ITEMS = [
  "NHS Trusts",
  "FTSE 350",
  "Training Providers",
  "UK SMEs",
  "ESFA Registered",
  "Ofsted Ready",
  "WCAG 2.1 AA",
  "DAS API Integration",
];

export default function Marquee() {
  // Duplicate for seamless loop
  const track = [...ITEMS, ...ITEMS];

  return (
    <div className="bg-emerald-700 py-3 overflow-hidden">
      <div
        className="flex gap-12 whitespace-nowrap"
        style={{
          animation: "marquee 25s linear infinite",
          width: "max-content",
        }}
      >
        {track.map((item, i) => (
          <span
            key={i}
            className="font-mono text-xs font-medium text-white/70 tracking-widest uppercase after:content-['·'] after:ml-12 after:text-white/30"
          >
            {item}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
