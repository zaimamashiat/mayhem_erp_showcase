import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NEXT_PUBLIC_SUPABASE_URL': 'undefined',
    'process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY': 'undefined',
  },
  resolve: { dedupe: ['react', 'react-dom'] },
});
