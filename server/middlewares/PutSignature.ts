import type { Request, Response } from 'express';
import { knownPlayers } from '../main.ts';

export type PlayerSignatureRequest = {
	name: string;
	id: string;
};

export type PlayerSignatureResponse = {
	status: 'recognized' | 'taken' | 'short';
} | {
	status: 'registered';
	id: string;
	expirationTimestamp: number;
};

export function PutSignature( req: Request, res: Response ): void {
	const reqBody: PlayerSignatureRequest = req.body;

	const existingPlayer = knownPlayers.find( p => p.id === reqBody.id );

	if ( existingPlayer ) {
		const response: PlayerSignatureResponse = {
			status: 'recognized'
		};

		res.send( response );

		return;
	}

	if ( reqBody.name.length < 2 ) {
		const response: PlayerSignatureResponse = {
			status: 'short'
		};

		res.send( response );

		return;
	}

	const nameTaken = knownPlayers.find( p => p.name === reqBody.name );

	if ( nameTaken ) {
		const response: PlayerSignatureResponse = {
			status: 'taken'
		};

		res.send( response );

		return;
	}

	const newPlayerId = crypto.randomUUID();

	const expirationTimestamp = Date.now() + ( 1000 * 60 * 60 * 12 );

	knownPlayers.push( {
		name: reqBody.name,
		id: newPlayerId,
		expirationTimestamp
	} );

	const response: PlayerSignatureResponse = {
		status: 'registered',
		id: newPlayerId,
		expirationTimestamp
	};

	res.send( response );
}
