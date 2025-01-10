/**
 * See: https://www.i18next.com/overview/typescript
 */

import i18next from 'i18next';

import en from '../../lang/en.json' assert { type: 'json' };
import pl from '../../lang/pl.json' assert { type: 'json' };

export const defaultLanguage = 'en';
export const defaultLanguageNamespace = 'general';
export const languageResources = {
	en: {
		[defaultLanguageNamespace]: en
	},
	pl: {
		[defaultLanguageNamespace]: pl
	} as const
};

export type SupportedLanguage = keyof typeof languageResources;

declare module 'i18next' {
	interface CustomTypeOptions {
		defaultNS: typeof defaultLanguageNamespace;
		resources: typeof languageResources['en'];
	}
}

export async function initLangs(): Promise<void> {
	await i18next.init( {
		lng: defaultLanguage,
		defaultNS: defaultLanguageNamespace,
		resources: languageResources
	} );
}
