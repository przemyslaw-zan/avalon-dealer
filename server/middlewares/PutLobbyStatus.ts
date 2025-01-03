import type { Request, Response } from 'express';
import { type OngoingGame, type Player, knownPlayers, ongoingGames } from '../main.ts';

export type LobbyStatusRequest = {
	gameId: string;
	playerId: string;
};

export type LobbyStatusResponse = {
	game: OngoingGame;
	knownPlayers: Array<Player>;
};

export function PutLobbyStatus( req: Request, res: Response ): void {
	const reqBody: LobbyStatusRequest = req.body;

	const game = ongoingGames.find( g => g.gameId === reqBody.gameId );

	if ( !game ) {
		res.sendStatus( 404 );
	} else {
		const response: LobbyStatusResponse = { game, knownPlayers };

		res.send( response );
	}
}
