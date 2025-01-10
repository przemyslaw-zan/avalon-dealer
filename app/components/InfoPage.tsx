import { t } from 'i18next';
import { type ReactNode, useEffect } from 'react';
import type { GameStatus, PageProps } from '../App.tsx';
import { cards } from '../utils/cards.ts';
import { getCookie } from '../utils/cookies.ts';
import { fetchLobbyStatus } from '../utils/fetchLobbyStatus.ts';

export function InfoPage( { gameStatus, setGameStatus, setCurrentPage }: PageProps ): ReactNode {
	useEffect( () => {
		const intervalId = setInterval( () => {
			fetchLobbyStatus().then( res => setGameStatus( res ) );
		}, 500 );

		return (): void => clearInterval( intervalId );
	}, [] );

	useEffect( () => {
		if ( !gameStatus ) {
			return;
		}

		if ( !gameStatus.game.hasBegun ) {
			setCurrentPage( 'gameGuest' );
		}
	}, [ gameStatus ] );

	if ( !gameStatus ) {
		return (
			<p>
				Loading game status...
			</p>
		);
	}

	const playerId = getCookie();
	const playerName = gameStatus.knownPlayers.find( p => p.id === playerId )!.name;
	const playerGameData = gameStatus.game.players.find( p => p.id === playerId )!;

	if ( !playerGameData?.cardId ) {
		return (
			<>
				<b style={ { fontSize: '1.5rem' } }>
					{ playerName }
				</b>
				<span>
					{ t( 'gameInProgress' ) }
				</span>
			</>
		);
	}

	const playerCardId = playerGameData.cardId;
	const playerCard = cards.find( c => c.id === playerCardId )!;
	const playerMap = gameStatus.game.players
		.filter( player => player.cardId )
		.map( player => ( {
			...player,
			name: gameStatus.knownPlayers.find( p => p.id === player.id )!.name,
			card: cards.find( c => c.id === player.cardId )!
		} ) );

	const otherEvilPlayers = playerMap
		.filter( player => {
			if ( player.card.affiliation !== 'evil' ) {
				return false;
			}

			if ( player.card.id === 'oberon' ) {
				return false;
			}

			if ( player.id === playerId ) {
				return false;
			}

			return true;
		} );

	return (
		<>
			<i>
				{ t( 'gameBegunAt' ) }: { getDate( gameStatus ) }
			</i>
			<b style={ { fontSize: '1.5rem' } }>
				{ playerName }
			</b>
			<b style={ { fontSize: '2rem', color: playerCard.affiliation === 'good' ? 'blue' : 'red' } }>
				{ t( playerCard.id ) }
			</b>

			<img style={ { maxWidth: '300px', maxHeight: '300px' } } src={ playerCard.imgSrc }/>

			{ playerCardId === 'merlin' && (
				<>
					<span>
						{ t( 'evilPlayersAre' ) }:
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
						{ t( 'merlinIs' ) }:
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
						{ otherEvilPlayers.length ? `${t( 'otherEvilPlayersAre' )}:` : t( 'onlyEvilPlayer' ) }
					</span>
					<ul>
						{ otherEvilPlayers.map( player => (
							<li key={ player.id }>
								{ player.name }
								{ player.cardId === 'evilLancelot' && ` (${t( player.card.id )})` }
							</li>
						) ) }
					</ul>
				</>
			) }
			{ playerGameData.isHost && (
				<button
					onClick={ () => {
						const confirmed = confirm( t( 'endGameConfirmation' ) );

						if ( !confirmed ) {
							return;
						}

						setGameStatus( null );
						setCurrentPage( 'gameSetup' );
					} }
				>
					{ t( 'restartTheGame' ) }
				</button>
			) }
		</>
	);
}

function getDate( gameStatus: GameStatus ): string {
	if ( !gameStatus ) {
		return '?';
	}

	if ( !gameStatus.game.beginTimestamp ) {
		return '?';
	}

	const date = new Date( gameStatus.game.beginTimestamp );

	return date.toLocaleString();
}
