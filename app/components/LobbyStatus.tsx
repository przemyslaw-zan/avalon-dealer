import { type ReactNode, useEffect, useState } from 'react';
import type { LobbyStatusResponse } from '../../server/middlewares/PutLobbyStatus.ts';
import type { PageType } from '../App.tsx';
import { type CardId, cards } from '../utils/cards.ts';
import { fetchLobbyStatus } from '../utils/fetchLobbyStatus.ts';

export function LobbyStatus( {
	setCurrentPage,
	setPlayerCount
}: {
	setCurrentPage: ( arg: PageType ) => void;
	setPlayerCount?: ( arg: number ) => void;
} ): ReactNode {
	const [ status, setStatus ] = useState<null | LobbyStatusResponse>( null );

	useEffect( () => {
		const intervalId = setInterval( () => {
			fetchLobbyStatus().then( res => setStatus( res ) );
		}, 500 );

		return (): void => clearInterval( intervalId );
	}, [] );

	useEffect( () => {
		if ( !status ) {
			return;
		}

		if ( setPlayerCount ) {
			setPlayerCount( status.game.players.length );
		}

		if ( status.game.hasBegun ) {
			setCurrentPage( 'info' );
		}
	}, [ status ] );

	if ( !status ) {
		return (
			<p>
				Loading game status...
			</p>
		);
	}

	return (
		<>
			<b style={ { display: 'block', textAlign: 'center' } }>
				Selected cards:
			</b>
			<ol style={ { margin: 0 } }>
				{ ( Object.keys( status.game.selectedCards ) as Array<CardId> )
					.reduce<Array<CardId>>( ( output, cardId ) => {
						const count = status.game.selectedCards[cardId];

						output.push( ...Array( count ).fill( cardId ) );

						return output;
					}, [] )
					.map( ( cardId, i ) => {
						const card = cards.find( c => c.id === cardId )!;

						return (
							<li
								key={ cardId + i }
								style={ { color: card.affiliation === 'evil' ? 'red' : 'blue' } }
							>
								{ card.name }
							</li>
						);
					} ) }
			</ol>

			<b style={ { display: 'block', textAlign: 'center' } }>
				Players:
			</b>
			<ol style={ { margin: 0 } }>
				{ [ ...status.game.players ].map( ( player, i ) => {
					const knownPlayer = status.knownPlayers.find( p => p.id === player.id );

					let name = '?';

					if ( knownPlayer ) {
						name = knownPlayer.name;
					}

					if ( i === 0 ) {
						name = [ '👑', name ].join( ' ' );
					}

					return (
						<li key={ player.id }>
							{ name }
						</li>
					);
				} ) }
			</ol>
		</>
	);
}
