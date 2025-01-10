import { t } from 'i18next';
import { type ReactNode, useEffect, useState } from 'react';
import type { SelectedCards } from '../../server/main.ts';
import type { GameSetupRequest } from '../../server/middlewares/PutGameSetup.ts';
import type { GameStatus, PageProps } from '../App.tsx';
import { type Card, cards } from '../utils/cards.ts';
import { getCookie } from '../utils/cookies.ts';
import { getGameIdFromUrl, setGameIdInUrl } from '../utils/gameId.ts';
import { getServerUrl } from '../utils/getServerUrl.ts';
import { LobbyStatus } from './LobbyStatus.tsx';

export function GameSetupPage( pageProps: PageProps ): ReactNode {
	const { gameStatus, setCurrentPage } = pageProps;

	const [ gameBegun, setGameBegun ] = useState( false );
	const [ selectedCards, setSelectedCards ] = useState<SelectedCards>( getInitialSelectedCards( gameStatus ) );
	const [ canStartGame, setCanStartGame ] = useState( false );

	setGameIdInUrl();

	// Updating the card list on the server.
	useEffect( () => {
		const requestBody: GameSetupRequest = {
			gameId: getGameIdFromUrl()!,
			selectedCards,
			hostId: getCookie(),
			hasBegun: gameBegun
		};

		fetch( getServerUrl( 'gameSetup' ), {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify( requestBody )
		} ).then( () => {
			if ( gameBegun ) {
				setCurrentPage( 'info' );
			}
		} );
	}, [ gameBegun, selectedCards ] );

	useEffect( () => {
		if ( !gameStatus ) {
			return;
		}

		const equalPlayersAndCardCount = gameStatus.game.players.length === Object.values( selectedCards ).reduce( ( a, b ) => a + b );

		setCanStartGame( equalPlayersAndCardCount );
	}, [ gameStatus ] );

	function updateSelectedCards( card: Card, eventTarget: HTMLInputElement ): void {
		let newValue: number;

		if ( card.unique ) {
			newValue = eventTarget.checked ? 1 : 0;
		} else {
			newValue = Number( eventTarget.value );
		}

		if ( newValue < 0 ) {
			newValue = 0;
		}

		if ( newValue > 9 ) {
			newValue = 9;
		}

		if ( card.id === 'goodLancelot' || card.id === 'evilLancelot' ) {
			setSelectedCards( {
				...selectedCards,
				goodLancelot: newValue,
				evilLancelot: newValue
			} );
		} else {
			setSelectedCards( {
				...selectedCards,
				[card.id]: newValue
			} );
		}
	}

	return (
		<>
			<b style={ { display: 'block', textAlign: 'center' } }>
				{ t( 'selectCards' ) }
			</b>
			<div>
				{ cards.map( card => {
					return (
						<div key={ card.id }>
							<input
								type={ card.unique ? 'checkbox' : 'number' }
								style={ {
									width: '30px'
								} }
								disabled={ card.alwaysSelected ? true : false }
								checked={ card.unique && selectedCards[card.id] === 1 }
								value={ selectedCards[card.id] }
								onChange={ event => updateSelectedCards( card, event.target ) }
							/>
							<span
								style={ {
									paddingLeft: '5px',
									color: card.affiliation === 'evil' ? 'red' : 'blue'
								} }
							>
								{ t( card.id ) }
							</span>
						</div>
					);
				} ) }
			</div>
			<LobbyStatus { ...pageProps }/>
			<button disabled={ !canStartGame } onClick={ () => setGameBegun( true ) }>
				{ t( 'startTheGame' ) }
			</button>
			{ !canStartGame && (
				<span style={ { color: 'red' } }>
					{ t( 'unevenPlayersCards' ) }
				</span>
			) }
		</>
	);
}

function getInitialSelectedCards( gameStatus: GameStatus ): SelectedCards {
	if ( gameStatus ) {
		return gameStatus.game.selectedCards;
	}

	return cards.reduce( ( output, card ) => {
		output[card.id] = card.alwaysSelected ? 1 : 0;

		return output;
	}, {} as SelectedCards );
}
