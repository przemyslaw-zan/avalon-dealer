import { t } from 'i18next';
import { type ReactNode, useEffect } from 'react';
import type { PageProps } from '../App.tsx';
import { type CardId, cards } from '../utils/cards.ts';
import { fetchLobbyStatus } from '../utils/fetchLobbyStatus.ts';

export function LobbyStatus( { gameStatus, setGameStatus }: PageProps ): ReactNode {
	useEffect( () => {
		const intervalId = setInterval( () => {
			fetchLobbyStatus().then( res => setGameStatus( res ) );
		}, 500 );

		return (): void => clearInterval( intervalId );
	}, [] );

	if ( !gameStatus ) {
		return (
			<p>
				{ t( 'loadingGameStatus' ) }
			</p>
		);
	}

	return (
		<>
			<b style={ { display: 'block', textAlign: 'center' } }>
				{ t( 'selectedCards' ) }:
			</b>
			<ol style={ { margin: 0 } }>
				{ ( Object.keys( gameStatus.game.selectedCards ) as Array<CardId> )
					.reduce<Array<CardId>>( ( output, cardId ) => {
						const count = gameStatus.game.selectedCards[cardId];

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
								{ t( card.id ) }
							</li>
						);
					} ) }
			</ol>

			<b style={ { display: 'block', textAlign: 'center' } }>
				{ t( 'players' ) }:
			</b>
			<ol style={ { margin: 0 } }>
				{ [ ...gameStatus.game.players ].map( ( player, i ) => {
					const knownPlayer = gameStatus.knownPlayers.find( p => p.id === player.id );

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
