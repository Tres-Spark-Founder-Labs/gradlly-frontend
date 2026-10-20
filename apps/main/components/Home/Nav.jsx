import { useScrolled } from "@/hooks";

export default function Nav({ menuOpen, setMenuOpen }) {
  const scrolled = useScrolled(50);

  const navLinks = [
    ["#portals", "Platform"],
    ["#flow", "FlowPortal"],
    ["#pricing", "Pricing"],
    ["#testimonials", "Reviews"],
  ];

  return (
    <>
      {/* Desktop / top bar */}
      <nav
        className={`fixed top-0 left-0  right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-stone-50/90 backdrop-blur-md border-b border-stone-200/80 transition-shadow duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <a
          href="#"
          className="font-serif text-black font-semibold mt-3 text-2xl tracking-tight"
        >
          Gradl<span className="text-emerald-700">ly</span>
        </a>

        <ul className="hidden md:flex items-center gap-8 list-none">
          {navLinks.map(([href, label]) => (
            <li key={label}>
              <a
                href={href}
                className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex  items-center gap-3">
          <a
            href="#"
            className="hidden md:flex px-6 py-1 justify-center items-center text-sm font-semibold  rounded-full border border-stone-200 hover:border-emerald-700 text-emerald-700 transition-colors"
          >
            Sign in
          </a>
          <a
            href="#"
            className="text-sm font-semibold px-4  rounded-full bg-emerald-700 hidden md:flex items-center justify-center text-white hover:bg-emerald-600 transition-colors"
          >
            Get started free
          </a>
          <button
            className="md:hidden items-center flex mt-3 flex-col gap-1.5 p-1 bg-transparent border-0 cursor-pointer"
            onClick={() => setMenuOpen(true)}
          >
            {""}
            <span className="block w-5 h-0.5 bg-stone-800 rounded" />
            <span className="block w-5 h-0.5 bg-stone-800 rounded" />
            <span className="block w-5 h-0.5 bg-stone-800 rounded" />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[190] bg-stone-50 flex flex-col items-center justify-center gap-8">
          <button
            className="absolute top-6 right-8 text-2xl bg-transparent border-0 cursor-pointer text-stone-800"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
          {navLinks.map(([href, label]) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="font-serif text-4xl text-stone-900"
            >
              {label}
            </a>
          ))}
          <a
            href="#"
            className="mt-4 text-sm font-semibold px-6 py-3 rounded-full bg-emerald-700 text-white"
            onClick={() => setMenuOpen(false)}
          >
            Get started free
          </a>
        </div>
      )}
    </>
  );
}
