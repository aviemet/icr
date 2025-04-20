import { css } from "@linaria/core"

import { vars, theme } from "@/lib/theme"

/**
 * AppShell
 */
export const wrapper = css`
	overflow: auto;
	height: calc(100vh - ${ theme.other.footer.height }px);
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
	overflow-y: clip;
	
	[data-mantine-color-scheme="light"] & {
		border-right-color: ${ vars.colors.gray[2] };
		background-color: ${ vars.colors.white };
	}

	[data-mantine-color-scheme="dark"] & {
		background-color: ${ vars.colors.dark[8] };
	}

	// TODO: This animation doesn't work with display: none
	.hidden-when-closed {
		opacity: 1;
		transition: opacity 200ms, display 200ms;
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

	li {
		position: relative;

		&:hover > ul {
			display: flex;
		}
	}
`

export const navLink = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: ${ vars.spacing.xs } ${ vars.spacing.sm };
	border-radius: ${ vars.radius.sm };
	color: ${ vars.colors.dark[9] };
	text-decoration: none;
	transition: all 0.15s ease-in-out;

	[data-mantine-color-scheme="dark"] & {
		color: ${ vars.colors.white };
	}

	.content {
		display: flex;
		align-items: center;
		gap: ${ vars.spacing.xs };
	}

	.indicator {
		width: 0.875rem;
		height: 0.875rem;
		color: ${ vars.colors.gray[6] };
	}

	&:hover {
		background-color: ${ vars.colors.gray[1] };

		[data-mantine-color-scheme="dark"] & {
			background-color: ${ vars.colors.dark[6] };
		}
	}

	&.active {
		background-color: var(--mantine-color-primary-light);
		color: var(--mantine-color-primary-filled);

		[data-mantine-color-scheme="dark"] & {
			background-color: var(--mantine-color-primary-filled);
			color: ${ vars.colors.white };
		}
	}
`

export const submenu = css`
	display: none;
	flex-direction: column;
	gap: ${ vars.spacing.xs };
	position: absolute;
	left: 100%;
	top: 0;
	min-width: 200px;
	padding: ${ vars.spacing.xs };
	border-radius: ${ vars.radius.sm };
	
	[data-mantine-color-scheme="light"] & {
		background-color: ${ vars.colors.white };
		box-shadow: var(--mantine-shadow-md);
	}

	[data-mantine-color-scheme="dark"] & {
		background-color: ${ vars.colors.dark[8] };
		box-shadow: var(--mantine-shadow-md);
	}
`

export const navigation = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.xs };
`
