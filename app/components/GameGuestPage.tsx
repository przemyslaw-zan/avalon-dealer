import { type ReactNode, useEffect } from 'react';
import type { GameGuestRequest } from '../../server/middlewares/PutGameGuest.ts';
import type { PageType } from '../App.tsx';
import { getCookie } from '../utils/cookies.ts';
import { getGameIdFromUrl } from '../utils/gameId.ts';
import { getServerUrl } from '../utils/getServerUrl.ts';
import { LobbyStatus } from './LobbyStatus.tsx';

export function GameGuestPage( {
	setCurrentPage
}: {
	setCurrentPage: ( arg: PageType ) => void;
} ): ReactNode {
	useEffect( () => {
		const intervalId = setInterval( () => {
			const requestBody: GameGuestRequest = {
				gameId: getGameIdFromUrl()!,
				playerId: getCookie()
			};

			fetch( getServerUrl( 'gameGuest' ), {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( requestBody )
			} );
		}, 500 );

		return (): void => clearInterval( intervalId );
	}, [] );

	return <LobbyStatus setCurrentPage={ setCurrentPage }/>;
}
