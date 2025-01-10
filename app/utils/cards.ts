import assassinJpg from '../assets/assassin.jpg';
import evilLancelotJpg from '../assets/evilLancelot.jpg';
import goodLancelotJpg from '../assets/goodLancelot.jpg';
import merlinJpg from '../assets/merlin.jpg';
import minionJpg from '../assets/minion.jpg';
import mordredJpg from '../assets/mordred.jpg';
import morganaJpg from '../assets/morgana.jpg';
import oberonJpg from '../assets/oberon.jpg';
import percivalJpg from '../assets/percival.jpg';
import servantJpg from '../assets/servant.jpg';

declare module '*.jpg';

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
	imgSrc: string;
	unique: boolean;
	affiliation: 'good' | 'evil';
	alwaysSelected?: true;
};

export const cards: Array<Card> = [ {
	id: 'merlin',
	imgSrc: merlinJpg,
	unique: true,
	affiliation: 'good',
	alwaysSelected: true
}, {
	id: 'percival',
	imgSrc: percivalJpg,
	unique: true,
	affiliation: 'good'
}, {
	id: 'goodLancelot',
	imgSrc: goodLancelotJpg,
	unique: true,
	affiliation: 'good'
}, {
	id: 'servant',
	imgSrc: servantJpg,
	unique: false,
	affiliation: 'good'
}, {
	id: 'mordred',
	imgSrc: mordredJpg,
	unique: true,
	affiliation: 'evil'
}, {
	id: 'morgana',
	imgSrc: morganaJpg,
	unique: true,
	affiliation: 'evil'
}, {
	id: 'oberon',
	imgSrc: oberonJpg,
	unique: true,
	affiliation: 'evil'
}, {
	id: 'evilLancelot',
	imgSrc: evilLancelotJpg,
	unique: true,
	affiliation: 'evil'
}, {
	id: 'assassin',
	imgSrc: assassinJpg,
	unique: true,
	affiliation: 'evil',
	alwaysSelected: true
}, {
	id: 'minion',
	imgSrc: minionJpg,
	unique: false,
	affiliation: 'evil'
} ];
