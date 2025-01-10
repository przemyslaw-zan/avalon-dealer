import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import type { CardId } from '../app/utils/cards.ts';
import { PutGameGuest } from './middlewares/PutGameGuest.ts';
import { PutGameSetup } from './middlewares/PutGameSetup.ts';
import { PutLobbyStatus } from './middlewares/PutLobbyStatus.ts';
import { PutSignature } from './middlewares/PutSignature.ts';

const PORT = 3000;

// 6h
const gameTimeout = 1000 * 60 * 60 * 6;

// 5s
const playerTimeout = 1000 * 5;

const server = express();

server.use( cors() );
server.use( bodyParser.json() );

server.listen( PORT, () => console.log( 'Server listening on PORT:', PORT ) );

export type Player = {
	name: string;
	id: string;
	expirationTimestamp: number;
};

export type OngoingGame = {
	gameId: string;
	selectedCards: SelectedCards;
	setupTimestamp: number;
	beginTimestamp?: number;
	hasBegun: boolean;
	players: Array<{
		id: string;
		timestamp: number;
		isHost: boolean;
		cardId?: CardId;
	}>;
};

export type SelectedCards = Record<CardId, number>;

export const knownPlayers: Array<Player> = [];
export const ongoingGames: Array<OngoingGame> = [];

server.put( '/gameGuest', PutGameGuest );
server.put( '/gameSetup', PutGameSetup );
server.put( '/lobbyStatus', PutLobbyStatus );
server.put( '/signature', PutSignature );

setInterval( () => {
	// Delete stale games.
	ongoingGames.splice( 0, ongoingGames.length, ...ongoingGames.filter( game => Date.now() - game.setupTimestamp < gameTimeout ) );

	// Delete stale players.
	knownPlayers.splice( 0, knownPlayers.length, ...knownPlayers.filter( player => Date.now() - player.expirationTimestamp < 0 ) );

	// Remove players who timed out from lobbies.
	ongoingGames.filter( game => !game.hasBegun ).forEach( game => {
		game.players = game.players.filter( player => {
			return player.isHost || ( Date.now() - player.timestamp < playerTimeout );
		} );
	} );
}, 1000 );
