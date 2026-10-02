// Vite config: React + Tailwind CSS v4 (the official @tailwindcss/vite plugin, no tailwind.config.js needed).

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
