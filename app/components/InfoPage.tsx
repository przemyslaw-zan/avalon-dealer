import { type ReactNode, useEffect, useState } from 'react';
import type { LobbyStatusResponse } from '../../server/middlewares/PutLobbyStatus.ts';
import { cards } from '../utils/cards.ts';
import { getCookie } from '../utils/cookies.ts';
import { fetchLobbyStatus } from '../utils/fetchLobbyStatus.ts';

export function InfoPage(): ReactNode {
	const [ status, setStatus ] = useState<null | LobbyStatusResponse>( null );

	useEffect( () => {
		const intervalId = setInterval( () => {
			fetchLobbyStatus().then( res => setStatus( res ) );
		}, 500 );

		return (): void => clearInterval( intervalId );
	}, [] );

	if ( !status ) {
		return (
			<p>
				Loading game status...
			</p>
		);
	}

	const playerId = getCookie();
	const playerName = status.knownPlayers.find( p => p.id === playerId )!.name;
	const playerCardId = status.game.players.find( p => p.id === playerId )!.cardId!;
	const playerCard = cards.find( c => c.id === playerCardId )!;
	const playerMap = status.game.players.map( player => {
		return {
			...player,
			name: status.knownPlayers.find( p => p.id === player.id )!.name,
			card: cards.find( c => c.id === player.cardId )!
		};
	} );

	return (
		<>
			<b style={ { fontSize: '1.5rem' } }>
				{ playerName }
			</b>
			<b style={ { fontSize: '2rem' } }>
				{ playerCard.name }
			</b>

			{ playerCardId === 'merlin' && (
				<>
					<span>
						Evil players are:
					</span>
					<ul>
						{ playerMap
							.filter( player => player.card.affiliation === 'evil' && player.card.id !== 'mordred' )
							.map( player => (
								<li key={ player.id }>
									{ player.name }
								</li>
							) ) }
					</ul>
				</>
			) }
			{ playerCardId === 'percival' && (
				<>
					<span>
						Merlin is:
					</span>
					<ul>
						{ playerMap
							.filter( player => [ 'merlin', 'morgana' ].includes( player.card.id ) )
							.map( player => (
								<li key={ player.id }>
									{ player.name }
								</li>
							) ) }
					</ul>
				</>
			) }
			{ [ 'mordred', 'morgana', 'assassin', 'minion' ].includes( playerCardId ) && (
				<>
					<span>
						Other evil players are:
					</span>
					<ul>
						{ playerMap
							.filter( player => player.card.affiliation === 'evil' && player.card.id !== 'oberon' )
							.map( player => (
								<li key={ player.id }>
									{ player.name }
									{ player.cardId === 'evilLancelot' && ` (${player.card.name})` }
								</li>
							) ) }
					</ul>
				</>
			) }
		</>
	);
}
