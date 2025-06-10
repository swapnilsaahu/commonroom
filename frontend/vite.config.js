import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: '0.0.0.0',
        porxy: {
            '/api': {
                target: `${import.meta.env.VITE_API_BASE_URL}`,
                changeOrigin: true,
            }
        }
    }
})
