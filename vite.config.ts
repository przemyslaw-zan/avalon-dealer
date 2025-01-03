import vitePluginReact from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

export default defineConfig( {
	root: path.join( __dirname, 'app' ),
	build: {
		outDir: path.join( __dirname, 'build' ),
		emptyOutDir: true
	},
	plugins: [
		vitePluginReact()
	]
} );
