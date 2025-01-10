import i18next, { t } from 'i18next';
import { QRCodeSVG } from 'qrcode.react';
import type { ReactNode } from 'react';
import { clearCookie } from '../utils/cookies.ts';
import { clearGameIdInUrl } from '../utils/gameId.ts';
import { type SupportedLanguage, languageResources } from '../utils/initLangs.ts';

const languageKeys = Object.keys( languageResources ) as Array<SupportedLanguage>;

const optionsLanguageSelectId = 'optionsLanguageSelectId';

export function Options( {
	open,
	selectedLanguage,
	setSelectedLanguage
}: {
	open: boolean;
	selectedLanguage: SupportedLanguage;
	setSelectedLanguage: ( lang: SupportedLanguage ) => void;
} ): ReactNode {
	return (
		<div
			style={ {
				position: 'absolute',
				top: '0px',
				right: '0px',
				display: open ? 'flex' : 'none',
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
				{ t( 'newGame' ) }
			</button>

			<button
				onClick={ () => {
					clearCookie();
					window.location.reload();
				} }
			>
				{ t( 'changeName' ) }
			</button>

			<label htmlFor={ optionsLanguageSelectId }>
				{ t( 'changeLanguage' ) }:
			</label>
			<select
				id={ optionsLanguageSelectId }
				value={ selectedLanguage }
				onChange={ event => {
					const newLanguage = event.target.value as SupportedLanguage;

					i18next.changeLanguage( newLanguage ).then( () => {
						setSelectedLanguage( newLanguage );
					} );
				} }
			>
				{ languageKeys.map( langKey => {
					const languageName = new Intl.DisplayNames( langKey, { type: 'language' } );

					return (
						<option key={ langKey } value={ langKey }>
							{ languageName.of( langKey ) }
						</option>
					);
				} ) }
			</select>
		</div>
	);
}
