import type { Request, Response } from 'express';
import { ongoingGames } from '../main.ts';

export type GameGuestRequest = {
	gameId: string;
	playerId: string;
};

export function PutGameGuest( req: Request, res: Response ): void {
	const reqBody: GameGuestRequest = req.body;

	const existingGame = ongoingGames.find( game => game.gameId === reqBody.gameId );

	if ( !existingGame ) {
		res.sendStatus( 404 );

		return;
	}

	const existingPlayer = existingGame.players.find( p => p.id === reqBody.playerId );

	if ( existingPlayer ) {
		existingPlayer.timestamp = Date.now();
	} else {
		existingGame.players.push( {
			id: reqBody.playerId,
			timestamp: Date.now(),
			isHost: false
		} );
	}

	res.send();
}
