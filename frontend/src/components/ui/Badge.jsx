// Small colored pill. `color` is a string of Tailwind classes (see STATUS_COLORS in utils/constants.js).
//   <Badge color={STATUS_COLORS.Open}>Open</Badge>
// StatusBadge and PriorityBadge are built on top of this.

const DEFAULT_COLOR = 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200';

export default function Badge({ color = DEFAULT_COLOR, className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${color} ${className}`}
    >
      {children}
    </span>
  );
}
