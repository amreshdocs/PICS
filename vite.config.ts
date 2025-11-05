import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Get API base URL from environment variable
const apiBaseUrl =
  process.env.VITE_POL_API_BASE_URL;

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': '/src',
      '@/shared': '/src/shared',
      '@/features': '/src/features',
      '@/pages': '/src/pages',
      '@/app': '/src/app',
      '@/assets': '/src/assets',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor libraries into separate chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router-dom')) {
              return 'router-vendor';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }
            if (id.includes('recharts')) {
              return 'charts-vendor';
            }
            if (id.includes('axios')) {
              return 'http-vendor';
            }
            // Group all other node_modules into vendor chunk
            return 'vendor';
          }

          // Split features into separate chunks for better caching
          if (id.includes('src/features/customers')) {
            return 'customers-feature';
          }
          if (id.includes('src/features/transfers')) {
            return 'transfers-feature';
          }
          if (id.includes('src/features/payments')) {
            return 'payments-feature';
          }
          if (id.includes('src/features/dashboard')) {
            return 'dashboard-feature';
          }
        },
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 500,
    // Enable source maps for better debugging in production (optional)
    sourcemap: false,
  },
  server: {
    proxy: {
      '/api': {
        target: `${apiBaseUrl}`,
        changeOrigin: true,
        secure: true,
        // Removed proxy event handlers due to TypeScript compatibility issues
        // Basic proxy configuration is sufficient for development
      },
      '/urn:TaxId:': {
        target: `${apiBaseUrl}`,
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
