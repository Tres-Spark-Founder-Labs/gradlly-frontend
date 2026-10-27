const STATS = [
  ["£3.5B", "Levy unclaimed every year"],
  ["750K", "UK apprentices underserved"],
  ["£0", "Cost to SME via FlowPortal"],
  ["4", "Portals. One shared data layer."],
];

export default function Stats() {
  return (
    <div className="bg-stone-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map(([val, label], i) => (
            <div
              key={i}
              className={`px-6 py-6 text-center ${i < 3 ? "border-r border-white/10" : ""}`}
            >
              <div className="font-serif text-4xl md:text-5xl text-amber-400 leading-none mb-2">
                {val}
              </div>
              <div className="text-xs text-white/50 tracking-wide">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
