import Link from "next/link";

const shapeStyles = { square: "rounded-lg", circle: "rounded-full" };

const sizeConfig = {
  xs: { padding: "p-1", iconSize: 12 },
  sm: { padding: "p-1.5", iconSize: 14 },
  md: { padding: "p-2", iconSize: 16 },
  lg: { padding: "p-2.5", iconSize: 20 },
  xl: { padding: "p-3", iconSize: 24 },
  "2xl": { padding: "p-4", iconSize: 28 },
};

const colorVariants = {
  light: {
    green:
      "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700/50 dark:hover:bg-green-900/30",
    blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700/50",
    indigo:
      "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-700/50",
    purple:
      "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:border-purple-300 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700/50",
    pink: "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 hover:border-pink-300 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-700/50",
    rose: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-700/50",
    red: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700/50",
    orange:
      "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 hover:border-orange-300 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700/50",
    yellow:
      "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700/50",
    amber:
      "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700/50",
    lime: "bg-lime-50 text-lime-700 border-lime-200 hover:bg-lime-100 hover:border-lime-300 dark:bg-lime-900/20 dark:text-lime-300 dark:border-lime-700/50",
    emerald:
      "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700/50",
    teal: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 hover:border-teal-300 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-700/50",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100 hover:border-cyan-300 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-700/50",
    sky: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 hover:border-sky-300 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-700/50",
    violet:
      "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 hover:border-violet-300 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-700/50",
    fuchsia:
      "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-100 hover:border-fuchsia-300 dark:bg-fuchsia-900/20 dark:text-fuchsia-300 dark:border-fuchsia-700/50",
    gray: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-600/50",
    slate:
      "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-600/50",
    white:
      "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 hover:border-gray-300 dark:bg-white/10 dark:text-white dark:border-white/20",
  },
  solid: {
    green:
      "bg-linear-to-br from-green-500 to-green-600 text-white border-green-400 hover:from-green-600 hover:to-green-700 shadow-sm hover:shadow-md",
    blue: "bg-linear-to-br from-blue-500 to-blue-600 text-white border-blue-400 hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md",
    indigo:
      "bg-linear-to-br from-indigo-500 to-indigo-600 text-white border-indigo-400 hover:from-indigo-600 hover:to-indigo-700 shadow-sm hover:shadow-md",
    purple:
      "bg-linear-to-br from-purple-500 to-purple-600 text-white border-purple-400 hover:from-purple-600 hover:to-purple-700 shadow-sm hover:shadow-md",
    pink: "bg-linear-to-br from-pink-500 to-pink-600 text-white border-pink-400 hover:from-pink-600 hover:to-pink-700 shadow-sm hover:shadow-md",
    rose: "bg-linear-to-br from-rose-500 to-rose-600 text-white border-rose-400 hover:from-rose-600 hover:to-rose-700 shadow-sm hover:shadow-md",
    red: "bg-linear-to-br from-red-500 to-red-600 text-white border-red-400 hover:from-red-600 hover:to-red-700 shadow-sm hover:shadow-md",
    orange:
      "bg-linear-to-br from-orange-500 to-orange-600 text-white border-orange-400 hover:from-orange-600 hover:to-orange-700 shadow-sm hover:shadow-md",
    yellow:
      "bg-linear-to-br from-yellow-400 to-yellow-500 text-gray-900 border-yellow-300 hover:from-yellow-500 hover:to-yellow-600 shadow-sm hover:shadow-md",
    amber:
      "bg-linear-to-br from-amber-500 to-amber-600 text-white border-amber-400 hover:from-amber-600 hover:to-amber-700 shadow-sm hover:shadow-md",
    lime: "bg-linear-to-br from-lime-500 to-lime-600 text-gray-900 border-lime-400 hover:from-lime-600 hover:to-lime-700 shadow-sm hover:shadow-md",
    emerald:
      "bg-linear-to-br from-emerald-500 to-emerald-600 text-white border-emerald-400 hover:from-emerald-600 hover:to-emerald-700 shadow-sm hover:shadow-md",
    teal: "bg-linear-to-br from-teal-500 to-teal-600 text-white border-teal-400 hover:from-teal-600 hover:to-teal-700 shadow-sm hover:shadow-md",
    cyan: "bg-linear-to-br from-cyan-500 to-cyan-600 text-white border-cyan-400 hover:from-cyan-600 hover:to-cyan-700 shadow-sm hover:shadow-md",
    sky: "bg-linear-to-br from-sky-500 to-sky-600 text-white border-sky-400 hover:from-sky-600 hover:to-sky-700 shadow-sm hover:shadow-md",
    violet:
      "bg-linear-to-br from-violet-500 to-violet-600 text-white border-violet-400 hover:from-violet-600 hover:to-violet-700 shadow-sm hover:shadow-md",
    fuchsia:
      "bg-linear-to-br from-fuchsia-500 to-fuchsia-600 text-white border-fuchsia-400 hover:from-fuchsia-600 hover:to-fuchsia-700 shadow-sm hover:shadow-md",
    gray: "bg-linear-to-br from-gray-500 to-gray-600 text-white border-gray-400 hover:from-gray-600 hover:to-gray-700 shadow-sm hover:shadow-md",
    slate:
      "bg-linear-to-br from-slate-500 to-slate-600 text-white border-slate-400 hover:from-slate-600 hover:to-slate-700 shadow-sm hover:shadow-md",
    white:
      "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md",
  },
  outline: {
    green:
      "bg-transparent text-green-700 border-green-500 hover:bg-green-50 dark:text-green-300 dark:border-green-500 dark:hover:bg-green-900/20",
    blue: "bg-transparent text-blue-700 border-blue-500 hover:bg-blue-50 dark:text-blue-300 dark:border-blue-500 dark:hover:bg-blue-900/20",
    purple:
      "bg-transparent text-purple-700 border-purple-500 hover:bg-purple-50 dark:text-purple-300 dark:border-purple-500 dark:hover:bg-purple-900/20",
    red: "bg-transparent text-red-700 border-red-500 hover:bg-red-50 dark:text-red-300 dark:border-red-500 dark:hover:bg-red-900/20",
    orange:
      "bg-transparent text-orange-700 border-orange-500 hover:bg-orange-50 dark:text-orange-300 dark:border-orange-500 dark:hover:bg-orange-900/20",
    gray: "bg-transparent text-gray-700 border-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-800/50",
  },
};

const IconBadge = ({
  variant = "light",
  color = "white",
  size = "md",
  shape = "square",
  icon,
  className = "",
  href,
  external = false,
  onClick,
  disabled = false,
  ariaLabel,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 border-1 hover:scale-110 active:scale-95";
  const { padding, iconSize } = sizeConfig[size] ?? sizeConfig.md;
  const shapeClass = shapeStyles[shape] ?? shapeStyles.square;
  const colorClass =
    colorVariants[variant]?.[color] ?? colorVariants.light.white;
  const disabledClass = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";
  const interactiveClass =
    (href || onClick) && !disabled ? "cursor-pointer" : "";
  const combinedClassName = [
    baseStyles,
    shapeClass,
    padding,
    colorClass,
    disabledClass,
    interactiveClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const iconContent = (
    <span
      className="flex items-center justify-center"
      style={{ width: iconSize, height: iconSize }}
    >
      {icon}
    </span>
  );

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClassName}
        onClick={onClick}
        aria-label={ariaLabel || "External icon link"}
      >
        {iconContent}
      </a>
    );
  }
  if (href) {
    return (
      <Link
        href={href}
        className={combinedClassName}
        onClick={onClick}
        aria-label={ariaLabel || "Icon link"}
      >
        {iconContent}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button
        type="button"
        className={combinedClassName}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel || "Icon button"}
      >
        {iconContent}
      </button>
    );
  }
  return (
    <span className={combinedClassName} aria-label={ariaLabel}>
      {iconContent}
    </span>
  );
};

export default IconBadge;
