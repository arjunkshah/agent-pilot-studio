
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  esbuild: {
    target: 'es2020',
    jsx: 'automatic',
    // Force esbuild to handle all TypeScript compilation
    loader: 'tsx',
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    esbuildOptions: {
      loader: {
        '.ts': 'tsx',
        '.tsx': 'tsx'
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  // Completely bypass TypeScript checking
  clearScreen: false,
  // Force Vite to ignore TypeScript config files entirely for build
  typescript: {
    compilerOptions: {
      declaration: false,
      declarationMap: false,
      emitDeclarationOnly: false,
      noEmit: true,
      skipLibCheck: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      moduleResolution: 'node',
      target: 'es2020',
      lib: ['es2020', 'dom', 'dom.iterable'],
      module: 'esnext',
      strict: false,
      jsx: 'react-jsx'
    }
  }
}));
