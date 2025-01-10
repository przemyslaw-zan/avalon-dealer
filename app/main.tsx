import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import { initLangs } from './utils/initLangs.ts';

await initLangs();

ReactDOM.createRoot( document.querySelector( '#app' )! ).render(
	(
		<StrictMode>
			<App/>
		</StrictMode>
	)
);
