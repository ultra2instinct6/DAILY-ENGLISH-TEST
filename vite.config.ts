import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/DAILY-ENGLISH-TEST/',
  plugins: [react()],
});