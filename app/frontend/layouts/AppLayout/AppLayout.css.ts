import { css } from "@linaria/core"

import { vars, theme } from "@/lib/theme"

/**
 * AppShell
 */
export const wrapper = css`
	--icr-field-bg: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[8] });
	--icr-field-border: light-dark(${ vars.colors.gray[4] }, ${ vars.colors.dark[3] });

	overflow: auto;
	height: calc(100vh - ${ theme.other.footer.height }px);
	padding: ${ vars.spacing.sm };
	background-color: light-dark(${ vars.colors.gray[1] }, ${ vars.colors.gray[9] });
`

/**
 * Top bar
 */
export const topbar = css`
	transition: left 100ms ease-in-out;
	background-color: ${ vars.colors.blue[6] };
	color: ${ vars.colors.white };

	@media (min-width: ${ vars.breakpoints.sm }) {
		left: ${ theme.other.navbar.width.open }px;

		&.closed {
			left: ${ theme.other.navbar.width.closed }px;
		}
	}
`

/**
 * Sidebar section
 */
export const navbar = css`
	transition: width 250ms ease-in-out, min-width 250ms ease-in-out;
	overflow-y: auto;
	
	[data-mantine-color-scheme="light"] & {
		border-right-color: ${ vars.colors.gray[2] };
		background-color: color-mix(in srgb, ${ vars.colors.primaryColors.filled } 6%, ${ vars.colors.gray[1] });
	}

	[data-mantine-color-scheme="dark"] & {
		background-color: color-mix(in srgb, ${ vars.colors.primaryColors.filled } 12%, black);
	}

	.hidden-when-closed,
	.label {
		opacity: 1;
		visibility: visible;
		max-width: 14rem;
		max-height: 4rem;
		overflow: hidden;
		white-space: nowrap;
		transition: opacity 200ms ease, max-width 200ms ease, max-height 200ms ease, visibility 0s linear 0s;
	}

	.user-menu-trigger {
		transition: width 200ms ease, height 200ms ease;
	}

	#user-menu {
		transition: width 200ms ease, height 200ms ease, min-width 200ms ease;
	}

	&.closed {
		overflow-y: clip;

		.hidden-when-closed,
		.label {
			opacity: 0;
			visibility: hidden;
			max-width: 0;
			max-height: 0;
			transition: opacity 200ms ease, max-width 200ms ease, max-height 200ms ease, visibility 0s linear 200ms;
		}

		.user-menu-trigger {
			width: 1.5rem;
			height: 1.5rem;
			min-height: 1.5rem;
		}

		#user-menu {
			width: 1.5rem;
			height: 1.5rem;
			min-width: 1.5rem;
		}

		.header-section {
			padding: ${ vars.spacing.xs } ${ vars.spacing.xxs };
			padding-bottom: ${ vars.spacing.xxs };
		}

		.nav-section {
			padding-inline: 0;
			padding-block: ${ vars.spacing.xs };
		}

		.nav-link {
			justify-content: center;
			padding: ${ vars.spacing.sm } 0;
		}

		.nav-link-anchor {
			flex: none;
			justify-content: center;
			width: 100%;
		}

		.content {
			gap: 0;
			justify-content: center;
			width: 100%;
		}

		.nav-section .nav-link svg {
			width: 1.5rem;
			height: 1.5rem;
		}

		.submenu {
			display: none;
			position: absolute;
			left: 100%;
			top: 0;
			min-width: 200px;
			padding: ${ vars.spacing.xs };
			border-radius: ${ vars.radius.sm };
			margin: 0;
			padding-inline-start: ${ vars.spacing.xs };

			[data-mantine-color-scheme="light"] & {
				background-color: ${ vars.colors.white };
				box-shadow: ${ vars.shadows.md };
			}

			[data-mantine-color-scheme="dark"] & {
				background-color: ${ vars.colors.dark[8] };
				box-shadow: ${ vars.shadows.md };
			}

			.label {
				opacity: 1;
				visibility: visible;
				max-width: 14rem;
			}

			.nav-link {
				justify-content: space-between;
				padding: ${ vars.spacing.xs } ${ vars.spacing.sm };
			}

			.content {
				gap: ${ vars.spacing.xs };
				justify-content: flex-start;
			}
		}

		li:hover > ul.submenu {
			display: flex;
		}
	}

	#site-logo, #site-logo svg {
		transition: width 250ms ease-in-out, 
			min-width 250ms ease-in-out, 
			height 250ms ease-in-out, 
			min-height 250ms ease-in-out,
			border-radius 250ms ease-in-out;
	}
`

export const main = css`
	#above-content-portal {
		padding: 0;
		margin: 0;
	}
`

export const nav = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.xs };
	padding: ${ vars.spacing.xs };
	transition: padding 200ms ease;

	li {
		position: relative;
	}
`

export const navLink = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: ${ vars.spacing.xs } ${ vars.spacing.sm };
	color: ${ vars.colors.dark[9] };
	text-decoration: none;
	transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, padding 200ms ease;

	[data-mantine-color-scheme="dark"] & {
		color: ${ vars.colors.white };
	}

	.nav-link-anchor {
		display: flex;
		flex: 1;
		min-width: 0;
		color: inherit;
		text-decoration: none;
	}

	.content {
		display: flex;
		align-items: center;
		gap: ${ vars.spacing.xs };
	}

	.indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 0.875rem;
		height: 0.875rem;
		padding: 0;
		border: none;
		background: transparent;
		color: ${ vars.colors.gray[6] };
		cursor: pointer;
		transition: transform 150ms ease;
	}

	.collapse-toggle {
		width: 1.25rem;
		height: 1.25rem;

		&.collapsed {
			transform: rotate(-90deg);
		}
	}

	&:hover {
		background-color: ${ vars.colors.gray[1] };

		[data-mantine-color-scheme="dark"] & {
			background-color: ${ vars.colors.dark[6] };
		}
	}

	&.active {
		background-color: light-dark(${ vars.colors.primaryColors[1] }, ${ vars.colors.primaryColors[9] });
		box-shadow: inset 3px 0 0 0 ${ vars.colors.primaryColors.filled };
		color: light-dark(${ vars.colors.primaryColors[9] }, ${ vars.colors.white });
	}
`

export const submenu = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.xs };
	position: static;
	margin: 0;
	padding: 0;
	min-width: 0;
	border-radius: 0;
	background-color: transparent;
	box-shadow: none;
	list-style: none;

	> li > .nav-link {
		padding-inline-start: calc(${ vars.spacing.sm } + ${ vars.spacing.md });
	}
`

export const navigation = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.xs };
`
