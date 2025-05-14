import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000, // This is my front end development port
    proxy: {
      // When my frontend makes a request to an api/route_endpoint',
      // the dev server will proxy it to 'http://localhost:5001/api/route_endpoint'.
      // This is to avoid CORS issues during development.
      '/api': {
        target: 'http://localhost:5001', // This is where my backend server is running.
        changeOrigin: true, // This is often needed for the proxy to work correctly.
        secure: false,      // My backend is HTTP, not HTTPS, so 'false' is correct.
        // I don't need a rewrite rule here because my backend routes already start with /api.
      },
    },
  },
});