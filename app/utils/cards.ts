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
	name: string;
	unique: boolean;
	affiliation: 'good' | 'evil';
	alwaysSelected?: true;
};

export const cards: Array<Card> = [ {
	id: 'merlin',
	name: 'Merlin',
	unique: true,
	affiliation: 'good',
	alwaysSelected: true
}, {
	id: 'percival',
	name: 'Percival',
	unique: true,
	affiliation: 'good'
}, {
	id: 'goodLancelot',
	name: 'Lancelot',
	unique: true,
	affiliation: 'good'
}, {
	id: 'servant',
	name: 'Loyal Servant of Arthur',
	unique: false,
	affiliation: 'good'
}, {
	id: 'mordred',
	name: 'Mordred',
	unique: true,
	affiliation: 'evil'
}, {
	id: 'morgana',
	name: 'Morgana',
	unique: true,
	affiliation: 'evil'
}, {
	id: 'oberon',
	name: 'Oberon',
	unique: true,
	affiliation: 'evil'
}, {
	id: 'evilLancelot',
	name: 'Lancelot',
	unique: true,
	affiliation: 'evil'
}, {
	id: 'assassin',
	name: 'Assassin',
	unique: true,
	affiliation: 'evil',
	alwaysSelected: true
}, {
	id: 'minion',
	name: 'Minion of Mordred',
	unique: false,
	affiliation: 'evil'
} ];
