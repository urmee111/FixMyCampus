// The frame around every page: skip link, Navbar, page content, footer.
// <Outlet /> is where the current page (chosen by the router) is drawn.

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Accessibility: keyboard users press Tab once to jump past the navbar.
          Hidden until it gets focus. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 focus:outline-none sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
        FixMyCampus · Report it. Upvote it. Track it. Fix it.
      </footer>
    </div>
  );
}
