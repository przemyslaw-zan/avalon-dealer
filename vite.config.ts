import vitePluginReact from '@vitejs/plugin-react';
import upath from 'upath';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath( import.meta.url );
const __dirname = upath.dirname( __filename );

export default defineConfig( {
	root: upath.join( __dirname, 'app' ),
	build: {
		outDir: upath.join( __dirname, 'build', 'app' ),
		emptyOutDir: true
	},
	plugins: [
		vitePluginReact()
	]
} );
