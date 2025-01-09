import type { Request, Response } from 'express';
import type { CardId } from '../../app/utils/cards.ts';
import { type SelectedCards, ongoingGames } from '../main.ts';

export type GameSetupRequest = {
	gameId: string;
	selectedCards: SelectedCards;
	hostId: string;
	hasBegun: boolean;
};

export function PutGameSetup( req: Request, res: Response ): void {
	const reqBody: GameSetupRequest = req.body;

	let existingGame = ongoingGames.find( game => game.gameId === reqBody.gameId );

	if ( !existingGame ) {
		existingGame = {
			gameId: reqBody.gameId,
			selectedCards: reqBody.selectedCards,
			setupTimestamp: Date.now(),
			hasBegun: reqBody.hasBegun,
			players: [ {
				id: reqBody.hostId,
				timestamp: Date.now(),
				isHost: true
			} ]
		};

		ongoingGames.push( existingGame );
	} else {
		existingGame.selectedCards = reqBody.selectedCards;
		existingGame.hasBegun = reqBody.hasBegun;
	}

	if ( existingGame.hasBegun ) {
		const cardIds = ( Object.keys( existingGame.selectedCards ) as Array<CardId> ).reduce( ( output, cardId ) => {
			const cardAmount = existingGame.selectedCards[cardId];

			output.push( ...new Array( cardAmount ).fill( cardId ) );

			return output;
		}, [] as Array<CardId> );

		shuffleArray( cardIds );

		existingGame.players.forEach( ( player, i ) => player.cardId = cardIds[i] );
		existingGame.beginTimestamp = Date.now();
	} else {
		existingGame.players.forEach( player => delete player.cardId );
		delete existingGame.beginTimestamp;
	}

	res.send();
}

/**
 * Durstenfeld shuffle algorithm.
 *
 * Source: https://stackoverflow.com/a/12646864
 */
function shuffleArray<T>( array: Array<T> ): void {
	for ( let i = array.length - 1; i >= 0; i-- ) {
		const j = Math.floor( Math.random() * ( i + 1 ) );
		[ array[i], array[j] ] = [ array[j], array[i] ];
	}
}
