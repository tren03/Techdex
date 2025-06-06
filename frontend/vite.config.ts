import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
  {
    name: "markdown-loader",
    transform(code, id) {
      if (id.endsWith('.md')) {
        return {
          code: `export default ${JSON.stringify(code)};`,
        };
      }
    }
  }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
