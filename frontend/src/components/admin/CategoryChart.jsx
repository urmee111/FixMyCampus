// TODO (Member C, Section 8): bar chart of issues per category, using recharts (BarChart).
// Data comes from stats.byCategory: { Electrical: 11, Water: 9, ... } -> convert to [{ name, count }].
// Make it responsive (ResponsiveContainer) and readable in dark mode.
// Props: data (stats.byCategory)

export default function CategoryChart({ data }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
      CategoryChart
    </div>
  );
}
