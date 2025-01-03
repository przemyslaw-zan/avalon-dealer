import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';

ReactDOM.createRoot( document.querySelector( '#app' )! ).render(
	(
		<StrictMode>
			<App/>
		</StrictMode>
	)
);
