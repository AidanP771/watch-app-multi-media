import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/watch-app-multi-media/", // Ensure this matches your GitHub repo name
});
