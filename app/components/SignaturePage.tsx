import { type ReactNode, useEffect, useState } from 'react';
import type { PlayerSignatureRequest, PlayerSignatureResponse } from '../../server/middlewares/PutSignature.ts';
import type { PageProps } from '../App.tsx';
import { getCookie, setCookie } from '../utils/cookies.ts';
import { fetchLobbyStatus } from '../utils/fetchLobbyStatus.ts';
import { getServerUrl } from '../utils/getServerUrl.ts';

const messages = {
	short: 'This name is too short!',
	taken: 'This name is taken!'
};

export function SignaturePage( { setCurrentPage }: PageProps ): ReactNode {
	const [ playerName, setPlayerName ] = useState( '' );
	const [ currentMessage, setCurrentMessage ] = useState( '' );

	useEffect( signatureRequest, [] );

	function signatureRequest(): void {
		const requestBody: PlayerSignatureRequest = {
			name: playerName.trim(),
			id: getCookie()
		};

		fetch( getServerUrl( 'signature' ), {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify( requestBody )
		} ).then( res => {
			return res.json();
		} ).then( async res => {
			const resBody: PlayerSignatureResponse = res;

			if ( resBody.status === 'short' ) {
				setCurrentMessage( messages.short );

				return;
			}

			if ( resBody.status === 'taken' ) {
				setCurrentMessage( messages.taken );

				return;
			}

			if ( resBody.status === 'registered' ) {
				setCookie( resBody.id, resBody.expirationTimestamp );
			}

			const lobbyStatus = await fetchLobbyStatus();

			if ( !lobbyStatus ) {
				return setCurrentPage( 'gameSetup' );
			}

			if ( lobbyStatus.game.hasBegun ) {
				return setCurrentPage( 'gameGuest' );
			}

			const host = lobbyStatus.game.players.find( p => p.isHost )!;

			if ( getCookie() === host.id ) {
				return setCurrentPage( 'gameSetup' );
			}

			return setCurrentPage( 'gameGuest' );
		} );
	}

	return (
		<>
			<div style={ { display: 'flex', gap: '5px' } }>
				<label>
					Player name:
				</label>
				<input
					value={ playerName }
					onChange={ event => {
						const newValue = sanitizeName( event.target.value );

						setCurrentMessage( newValue.trim().length < 2 ? messages.short : '' );
						setPlayerName( newValue );
					} }
				/>
			</div>
			<button
				disabled={ playerName.length < 2 }
				onClick={ () => signatureRequest() }
			>
				Next
			</button>
			<span>
				{ currentMessage }
			</span>
		</>
	);
}

function sanitizeName( name: string ): string {
	return name.replace( /[^a-zA-Z0-9 ]/g, '' );
}
