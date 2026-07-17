import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';

function copyExtensionAssets() {
  return {
    name: 'copy-extension-assets',
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist-extension');
      mkdirSync(outDir, { recursive: true });

      copyFileSync(path.resolve(__dirname, 'src/extension/manifest.json'), path.join(outDir, 'manifest.json'));

      const builtPopupPath = path.join(outDir, 'src', 'extension', 'popup.html');
      const targetPopupPath = path.join(outDir, 'popup.html');
      if (existsSync(builtPopupPath)) {
        copyFileSync(builtPopupPath, targetPopupPath);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyExtensionAssets()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist-extension',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/extension/popup.html'),
        background: path.resolve(__dirname, 'src/extension/background.ts'),
        content: path.resolve(__dirname, 'src/extension/content.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
});
