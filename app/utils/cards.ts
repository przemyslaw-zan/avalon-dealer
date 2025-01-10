export type CardId =
	| 'merlin'
	| 'percival'
	| 'goodLancelot'
	| 'servant'
	| 'mordred'
	| 'morgana'
	| 'oberon'
	| 'assassin'
	| 'evilLancelot'
	| 'minion';

export type Card = {
	id: CardId;
	unique: boolean;
	affiliation: 'good' | 'evil';
	alwaysSelected?: true;
};

export const cards: Array<Card> = [ {
	id: 'merlin',
	unique: true,
	affiliation: 'good',
	alwaysSelected: true
}, {
	id: 'percival',
	unique: true,
	affiliation: 'good'
}, {
	id: 'goodLancelot',
	unique: true,
	affiliation: 'good'
}, {
	id: 'servant',
	unique: false,
	affiliation: 'good'
}, {
	id: 'mordred',
	unique: true,
	affiliation: 'evil'
}, {
	id: 'morgana',
	unique: true,
	affiliation: 'evil'
}, {
	id: 'oberon',
	unique: true,
	affiliation: 'evil'
}, {
	id: 'evilLancelot',
	unique: true,
	affiliation: 'evil'
}, {
	id: 'assassin',
	unique: true,
	affiliation: 'evil',
	alwaysSelected: true
}, {
	id: 'minion',
	unique: false,
	affiliation: 'evil'
} ];
