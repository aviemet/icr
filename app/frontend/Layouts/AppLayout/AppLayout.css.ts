import { vars, theme } from '@/lib/theme'
import { css } from '@linaria/core'

/**
 * AppShell
 */
export const wrapper = css`
	overflow: auto;
	height: calc(100vh - ${theme.other.footer.height}px);
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
	transition: width 250ms ease-in-out, min-width 250ms ease-in-out;
	overflow-y: clip;
	
	${vars.lightSelector} {
		border-right-color: ${vars.colors.gray[2]};
		background-color: ${vars.colors.gray[2]};
	}

	${vars.darkSelector} {
		background-color: ${vars.colors.dark[6]};
	}

	// TODO: This animation doesn't work with display: none
	.hidden-when-closed {
		opacity: 1;
		transition: opacity 2000ms, display 200ms;
	}

	&.closed .hidden-when-closed {
		opacity: 0;
		display: none;
		visibility: hidden;
	}

	#site-logo, #site-logo svg {
		transition: width 250ms ease-in-out, 
			min-width 250ms ease-in-out, 
			height 250ms ease-in-out, 
			min-height 250ms ease-in-out,
			border-radius 250ms ease-in-out;
	}
`

export const navigation = css`
	/* ul {
		li {
			position: relative;

			& > ul {
				display: none;
				position: absolute;
				left: ${theme.other.navbar.width.open}px;
				top: 0;
				background-color: ${vars.colors.dark[5]};
				padding: ${vars.spacing.md};
				border-radius: ${vars.radius.md};
			}

			&:hover {
				& > ul {
					display: block;
				}
			}
		}		
	}

	.${navbar}.closed {
		ul li > ul {
			left: ${theme.other.navbar.width.closed}px;
		}
	} */
`

export const navLink = css`
	/*display: block;
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
			background-color: ${vars.colors.gray[4]};
		}

		${vars.darkSelector} {
			background-color: ${vars.colors.dark[8]};
		}
	}*/
`
