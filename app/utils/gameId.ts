const gameIdKey = 'gameId';

export function setGameIdInUrl(): void {
	const url = new URL( window.location.href );

	if ( url.searchParams.has( gameIdKey ) ) {
		return;
	}

	const newGameId = window.crypto.randomUUID();
	url.searchParams.set( gameIdKey, newGameId );
	window.history.pushState( null, '', url.toString() );
}

export function getGameIdFromUrl(): string | null {
	const url = new URL( window.location.href );

	return url.searchParams.get( gameIdKey );
}

export function clearGameIdInUrl(): void {
	const url = new URL( window.location.href );
	url.searchParams.delete( gameIdKey );
	window.history.pushState( null, '', url.toString() );
}
