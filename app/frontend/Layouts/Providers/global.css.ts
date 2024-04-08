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
			min-height: calc(100vh - ${theme.other.header.height}px - ${theme.other.footer.height}px - 20px);
		}

		label {
			font-size: 1rem;
		}
	}
`
