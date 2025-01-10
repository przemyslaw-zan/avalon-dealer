import { t } from 'i18next';
import { type ReactNode, useState } from 'react';
import type { LobbyStatusResponse } from '../server/middlewares/PutLobbyStatus.ts';
import { GameGuestPage } from './components/GameGuestPage.tsx';
import { GameSetupPage } from './components/GameSetupPage.tsx';
import { InfoPage } from './components/InfoPage.tsx';
import { Options } from './components/Options.tsx';
import { SignaturePage } from './components/SignaturePage.tsx';
import { type SupportedLanguage, defaultLanguage } from './utils/initLangs.ts';

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
	const [ selectedLanguage, setSelectedLanguage ] = useState<SupportedLanguage>( defaultLanguage );

	const pageProps: PageProps = { gameStatus, setGameStatus, setCurrentPage };

	return (
		<div
			style={ {
				fontFamily: 'Arial'
			} }
		>
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
						⚙️ { t( 'options' ) }
					</button>
				</div>
				{ currentPage === 'signature' && <SignaturePage { ...pageProps }/> }
				{ currentPage === 'gameSetup' && <GameSetupPage { ...pageProps }/> }
				{ currentPage === 'gameGuest' && <GameGuestPage { ...pageProps }/> }
				{ currentPage === 'info' && <InfoPage { ...pageProps }/> }
			</div>

			<Options open={ optionsOpen } selectedLanguage={ selectedLanguage } setSelectedLanguage={ setSelectedLanguage }/>
		</div>
	);
}
