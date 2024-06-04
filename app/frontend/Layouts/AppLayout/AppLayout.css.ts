import { vars, theme } from '@/lib/theme'
import { css } from '@linaria/core'

/**
 * AppShell
 */
export const wrapper = css`
	overflow: auto;
	height: calc(100vh - ${theme.other.header.height}px - ${theme.other.footer.height}px);
`

/**
 * Top bar
 */
export const topbar = css`
	transition: left 100ms ease-in-out;
	background-color: ${vars.colors.primaryColors.filled};
	
	color: ${vars.colors.white};

	@media (min-width: ${vars.breakpoints.sm}) {
		left: ${theme.other.navbar.width.open}px;

		&.closed {
			left: ${theme.other.navbar.width.closed}px;
		}
	}
`

/**
 * Sidebar section
 */

export const navbar = css`
	transition: width 100ms ease-in-out, min-width 100ms ease-in-out;
	overflow-y: clip;
	
	${vars.lightSelector} {
		border-right-color: ${vars.colors.gray[2]};
		background-color: ${vars.colors.gray[2]};
	}

	${vars.darkSelector} {
		background-color: ${vars.colors.dark[6]};
	} 
`

export const navLink = css`
	display: block;
	border-radius: ${vars.radius.md};
	transition: background-color 200ms ease-in-out;

	${vars.lightSelector} {
		color: ${vars.colors.dark[5]};
	}

	${vars.darkSelector} {
		color: ${vars.colors.white};
	}

	&:hover {
		text-decoration: none;
	}

	&.active, &:hover {
		${vars.lightSelector} {
			background-color: ${vars.colors.gray[3]};
		}

		${vars.darkSelector} {
			background-color: ${vars.colors.dark[8]};
		}
	}
`
