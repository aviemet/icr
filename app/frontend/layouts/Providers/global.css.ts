import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const globals = css`
	:global() {
		html, body, #app {
			height: 100%;
		}

		*::selection {
			background-color: ${ vars.colors.primary[2] }; // [2]
		}

		.hidden {
			display: none;
		}

		.fullHeight {
			display: flex;
			flex-direction: column;
		}

		label {
			font-size: 1rem;
		}

		em {
			font-style: italic;
		}

		b {
			font-weight: bold;
		}

		strong {
			font-weight: bold;
		}
	}

	@font-face {
		font-family: 'Roboto';
		src: url('/fonts/roboto/Roboto-VariableFont_wdth,wght.ttf') format('truetype-variations');
		font-weight: 100 900;
		font-stretch: 75% 100%;
		font-style: normal;
	}

	@font-face {
		font-family: 'Roboto';
		src: url('/fonts/roboto/Roboto-Italic-VariableFont_wdth,wght.ttf') format('truetype-variations');
		font-weight: 100 900;
		font-stretch: 75% 100%;
		font-style: italic;
	}

`
