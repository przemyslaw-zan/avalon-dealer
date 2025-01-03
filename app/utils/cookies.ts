export function setCookie( playerId: string, expirationTimestamp: number ): void {
	const date = new Date( expirationTimestamp );

	document.cookie = `playerId=${playerId}; samesite=strict; expires=${date.toUTCString()}`;
}

export function getCookie(): string {
	const match = document.cookie.match( /(?<=playerId=)[a-z0-9-]+/ );

	return match ? match[0] : '';
}

export function clearCookie(): void {
	const id = getCookie();

	if ( !id ) {
		return;
	}

	setCookie( id, Date.now() );
}
