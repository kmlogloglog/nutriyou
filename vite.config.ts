import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://cafxlzqdxtmdwjjyqpfz.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhZnhsenFkeHRtZHdqanlxcGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNDI0MzcsImV4cCI6MjA2MDkxODQzN30.aRI9Qdq-nxt0t9aHKjGcUYcjg5ydGlr0LKEtfMiEkdg')
  }
})