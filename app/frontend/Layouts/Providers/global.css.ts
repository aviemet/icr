import { css } from '@linaria/core'
import { vars, theme } from '@/lib/theme'

export const globals = css`
	:global() {
		html body {
			overflow: hidden;
		}

		*::selection {
			background-color: ${vars.colors.primary[2]}; // [2]
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
	}
`
