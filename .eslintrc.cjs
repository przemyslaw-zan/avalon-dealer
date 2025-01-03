module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime'
	],
	plugins: [
		'@typescript-eslint',
		'import',
		'react'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'script'
	},
	settings: {
		react: {
			version: 'detect'
		}
	},
	env: {
		browser: false,
		es2021: true,
		node: true
	},
	overrides: [ {
		files: [
			'./app/**/*'
		],
		env: {
			browser: true,
			node: false
		},
		parserOptions: {
			sourceType: 'module'
		}
	} ],
	rules: {
		'@typescript-eslint/consistent-type-imports': 'error',
		'@typescript-eslint/explicit-function-return-type': 'error',
		'import/no-default-export': 'error',
		'no-unused-expressions': 'error'
	}
};
