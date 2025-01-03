import type { LobbyStatusRequest, LobbyStatusResponse } from '../../server/middlewares/PutLobbyStatus.ts';
import { getCookie } from './cookies.ts';
import { getGameIdFromUrl } from './gameId.ts';
import { getServerUrl } from './getServerUrl.ts';

export function fetchLobbyStatus(): Promise<null | LobbyStatusResponse> {
	const requestBody: LobbyStatusRequest = {
		gameId: getGameIdFromUrl()!,
		playerId: getCookie()
	};

	return fetch( getServerUrl( 'lobbyStatus' ), {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify( requestBody )
	} ).then( res => {
		return res.status === 404 ? null : res.json();
	} );
}
