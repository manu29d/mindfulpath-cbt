import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Polyfill process.env for the app logic
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || process.env.API_KEY),
    },
    base: '', // Handles relative paths for GH Pages
    build: {
      chunkSizeWarningLimit: 1000, // Suppress warning for initial load (recharts + gemini are large)
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor chunks for better caching and parallel loading
            'vendor-react': ['react', 'react-dom'],
            'vendor-charts': ['recharts'],
            'vendor-gemini': ['@google/genai'],
          },
        },
      },
    },
  };
});