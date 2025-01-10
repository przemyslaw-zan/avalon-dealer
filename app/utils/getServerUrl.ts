declare global {
	interface Window {
		SERVER_ADDRESS: string;
	}
}

const { SERVER_ADDRESS } = window;

export function getServerUrl( path: string ): string {
	return [ SERVER_ADDRESS, path ].join( '/' );
}
