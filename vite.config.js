import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const erpRoot = path.resolve(rootDir, '../Mayhem_ERP_BASE');

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NEXT_PUBLIC_SUPABASE_URL': 'undefined',
    'process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY': 'undefined',
  },
  resolve: {
    alias: { '@': erpRoot },
    dedupe: ['react', 'react-dom'],
  },
  server: { fs: { allow: [rootDir, erpRoot] } },
});