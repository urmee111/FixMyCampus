// TODO (Member C, Section 8): QR code per location, using the qrcode.react package.
// Admin picks a Building (BUILDINGS) + optional spot, and we render a QR code that links to
//   `${window.location.origin}/report?location=${encodeURIComponent('Hall 2, Floor 3')}`
// so students can scan a sticker on the wall and report straight away. Add a "Download / Print" option.

export default function QrGenerator() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
      QrGenerator
    </div>
  );
}
