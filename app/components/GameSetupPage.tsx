import { type ReactNode, useEffect, useState } from 'react';
import type { SelectedCards } from '../../server/main.ts';
import type { GameSetupRequest } from '../../server/middlewares/PutGameSetup.ts';
import type { PageType } from '../App.tsx';
import { type Card, cards } from '../utils/cards.ts';
import { getCookie } from '../utils/cookies.ts';
import { getGameIdFromUrl, setGameIdInUrl } from '../utils/gameId.ts';
import { getServerUrl } from '../utils/getServerUrl.ts';
import { LobbyStatus } from './LobbyStatus.tsx';

export function GameSetupPage( {
	setCurrentPage
}: {
	setCurrentPage: ( arg: PageType ) => void;
} ): ReactNode {
	const [ playerCount, setPlayerCount ] = useState( 0 );
	const [ gameBegun, setGameBegun ] = useState( false );
	const [ selectedCards, setSelectedCards ] = useState<SelectedCards>(
		cards.reduce( ( output, card ) => {
			output[card.id] = card.alwaysSelected ? 1 : 0;

			return output;
		}, {} as SelectedCards )
	);

	const equalPlayersAndCardCount = playerCount === Object.values( selectedCards ).reduce( ( a, b ) => a + b );

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
		} );
	}, [ gameBegun, selectedCards ] );

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
				Select cards:
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
								{ card.name }
							</span>
						</div>
					);
				} ) }
			</div>
			<LobbyStatus setCurrentPage={ setCurrentPage } setPlayerCount={ setPlayerCount }/>
			<button disabled={ !equalPlayersAndCardCount } onClick={ () => setGameBegun( true ) }>
				Start the game
			</button>
			{ !equalPlayersAndCardCount && (
				<span style={ { color: 'red' } }>
					Uneven amount of players and selected cards!
				</span>
			) }
		</>
	);
}
