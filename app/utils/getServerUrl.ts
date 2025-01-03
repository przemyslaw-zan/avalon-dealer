import { PORT } from '../../config.ts';

export function getServerUrl( path: string ): string {
	const url = new URL( window.location.href );

	const pathnameParts = url.pathname.split( '/' ).filter( Boolean );
	pathnameParts.push( path );

	url.port = String( PORT );
	url.pathname += path;

	return url.toString();
}
