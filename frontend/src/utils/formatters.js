// Date helpers. Both accept an ISO date string (or Date) and return '' if it is empty.

const relativeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

// [unit, seconds in that unit], biggest first
const UNITS = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
];

// "3 hours ago", "yesterday", "just now"
export function timeAgo(date) {
  if (!date) return '';
  const seconds = Math.round((new Date(date).getTime() - Date.now()) / 1000); // negative = past
  if (Number.isNaN(seconds)) return '';

  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relativeFormat.format(Math.round(seconds / size), unit);
  }
  return 'just now';
}

// "2 Oct 2026, 17:35"
export function formatDate(date) {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(parsed);
}
