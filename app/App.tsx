import { QRCodeSVG } from 'qrcode.react';
import { type ReactNode, useState } from 'react';
import type { LobbyStatusResponse } from '../server/middlewares/PutLobbyStatus.ts';
import { GameGuestPage } from './components/GameGuestPage.tsx';
import { GameSetupPage } from './components/GameSetupPage.tsx';
import { InfoPage } from './components/InfoPage.tsx';
import { SignaturePage } from './components/SignaturePage.tsx';
import { clearCookie } from './utils/cookies.ts';
import { clearGameIdInUrl } from './utils/gameId.ts';

export type PageType = 'signature' | 'gameSetup' | 'gameGuest' | 'info';

export type GameStatus = LobbyStatusResponse | null;

export type PageProps = {
	gameStatus: GameStatus;
	setGameStatus: ( arg: GameStatus ) => void;
	setCurrentPage: ( arg: PageType ) => void;
};

export function App(): ReactNode {
	const [ gameStatus, setGameStatus ] = useState<GameStatus>( null );
	const [ currentPage, setCurrentPage ] = useState<PageType>( 'signature' );
	const [ optionsOpen, setOptionsOpen ] = useState( false );

	const pageProps: PageProps = { gameStatus, setGameStatus, setCurrentPage };

	return (
		<>
			<div
				style={ {
					position: 'absolute',
					top: '0px',
					left: '0px',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: '15px'
				} }
			>
				<div style={ { width: '100%' } }>
					<button onClick={ () => setOptionsOpen( !optionsOpen ) } style={ { width: 'fit-content' } }>
						⚙️ Options
					</button>
				</div>
				{ currentPage === 'signature' && <SignaturePage { ...pageProps }/> }
				{ currentPage === 'gameSetup' && <GameSetupPage { ...pageProps }/> }
				{ currentPage === 'gameGuest' && <GameGuestPage { ...pageProps }/> }
				{ currentPage === 'info' && <InfoPage { ...pageProps }/> }
			</div>

			<div
				style={ {
					position: 'absolute',
					top: '0px',
					right: '0px',
					display: optionsOpen ? 'flex' : 'none',
					flexDirection: 'column',
					gap: '10px',
					padding: '5px',
					backgroundColor: 'white',
					border: '1px black solid'
				} }
			>
				<QRCodeSVG value={ window.location.href }/>
				<button
					onClick={ () => {
						clearGameIdInUrl();
						window.location.reload();
					} }
				>
					New game
				</button>
				<button
					onClick={ () => {
						clearCookie();
						window.location.reload();
					} }
				>
					Change name
				</button>
			</div>
		</>
	);
}
