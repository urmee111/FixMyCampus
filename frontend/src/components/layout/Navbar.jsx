// Top bar: logo, links that depend on the user's role, dark-mode toggle, logout.
// On phones the links collapse into a menu button.

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogOut, Menu, Moon, Sun, Wrench, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

// Which links each kind of visitor sees
function getLinks(user) {
  if (!user) {
    return [
      { to: '/login', label: 'Log in' },
      { to: '/signup', label: 'Sign up' },
    ];
  }
  if (user.role === 'admin') {
    return [
      { to: '/issues', label: 'Issues' },
      { to: '/admin', label: 'Dashboard' },
    ];
  }
  return [
    { to: '/issues', label: 'Issues' },
    { to: '/report', label: 'Report an issue' },
    { to: '/my-reports', label: 'My reports' },
  ];
}

// Highlights the link of the page we are on
const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    isActive
      ? 'bg-blue-50 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
  }`;

const iconButtonClass =
  'inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // phone menu

  const links = getLinks(user);
  const closeMenu = () => setMenuOpen(false);

  function handleLogout() {
    logout();
    closeMenu();
    navigate('/login');
    toast.success('Logged out');
  }

  // Same button is used in the desktop bar and the phone bar
  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      className={iconButtonClass}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun aria-hidden="true" className="h-5 w-5" /> : <Moon aria-hidden="true" className="h-5 w-5" />}
    </button>
  );

  const logoutButton = user && (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <LogOut aria-hidden="true" className="h-4 w-4" />
      Log out
    </button>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        <Link to={user ? '/issues' : '/login'} className="flex items-center gap-2 text-lg font-bold">
          <Wrench aria-hidden="true" className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          FixMyCampus
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          {user && <span className="px-2 text-sm text-slate-600 dark:text-slate-400">Hi, {user.name}</span>}
          {themeButton}
          {logoutButton}
        </div>

        {/* Phone */}
        <div className="flex items-center gap-1 md:hidden">
          {themeButton}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={iconButtonClass}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="flex flex-col gap-1 border-t border-slate-200 px-4 py-3 dark:border-slate-800 md:hidden">
          {user && <p className="px-3 pb-1 text-sm text-slate-600 dark:text-slate-400">Signed in as {user.name}</p>}
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} onClick={closeMenu}>
              {link.label}
            </NavLink>
          ))}
          {logoutButton}
        </div>
      )}
    </header>
  );
}
