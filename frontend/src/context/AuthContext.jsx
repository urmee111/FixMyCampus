// Holds the logged-in user for the whole app.
// Use it through the useAuth() hook:  const { user, login, logout } = useAuth();
//
// The token + user are saved in localStorage so a page refresh keeps you logged in.

import { createContext, useEffect, useState } from 'react';
import * as authApi from '../api/auth';
import { TOKEN_KEY, USER_KEY } from '../api/client';

export const AuthContext = createContext(null);

// A JWT is three base64 parts separated by dots; the middle one holds `exp` (expiry, in seconds).
function isTokenExpired(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload.exp ? payload.exp * 1000 < Date.now() : false;
  } catch {
    return true; // unreadable token: treat as expired
  }
}

function clearStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, email, role } or null
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true until we have checked localStorage

  // On first load / page refresh: restore the session if the saved token is still valid
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);

    if (savedToken && savedUser && !isTokenExpired(savedToken)) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch {
        clearStorage(); // saved user was corrupted
      }
    } else {
      clearStorage();
    }
    setLoading(false);
  }, []);

  // Save a successful login/signup response ({ token, user })
  function saveSession(data) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  // These throw on failure (wrong password...), so the page can show the error.
  async function login(email, password) {
    const data = await authApi.login({ email, password });
    saveSession(data);
    return data.user;
  }

  async function signup(payload) {
    const data = await authApi.signup(payload);
    saveSession(data);
    return data.user;
  }

  function logout() {
    clearStorage();
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
