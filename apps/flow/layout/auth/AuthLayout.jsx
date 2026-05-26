import Link from "next/link";

import AuthLayoutSVG from "@/assets/svgs/AuthLayoutSVG";
import { GradllyLogo } from "@/assets/svgs/GradllyLogo";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#f7f7f2] font-sans antialiased">
      <aside className="hidden lg:flex relative overflow-hidden bg-[#0e2d1e] flex-col">
        <AuthLayoutSVG />
        <div className="relative z-10 mt-auto w-full px-12 xl:px-16 pb-14 xl:pb-16">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7ecb9a] mb-4">
            Automation Hub
          </span>
          <h2
            className="text-[30px] xl:text-[38px] font-bold text-[#e8f5ec] leading-[1.1] tracking-tight mb-4"
            style={{ textShadow: "0 2px 24px rgba(7,24,16,0.55)" }}
          >
            Automate your apprenticeship workflows and streamline processes.
          </h2>
          <p className="text-[14px] xl:text-[15px] font-light leading-relaxed text-[#a8c9b5]">
            Connect your systems, manage levy transfers and run flows that keep
            your programme running smoothly.
          </p>
        </div>
      </aside>

      <main className="h-screen overflow-y-auto relative flex items-center justify-center px-6 sm:px-10 py-20 sm:py-24 lg:py-16">
        <Link
          href="/"
          aria-label="Gradlly home"
          className="absolute top-6 left-6 sm:top-8 sm:left-8 lg:top-10 lg:left-10 flex items-center gap-2.5 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2"
        >
          <GradllyLogo size={36} />
          <span className="text-sm font-semibold tracking-tight text-primary-700">
            Gradlly
          </span>
        </Link>
        <div className="w-full mt-5">{children}</div>
      </main>
    </div>
  );
}
