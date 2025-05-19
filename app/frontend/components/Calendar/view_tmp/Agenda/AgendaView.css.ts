import { css } from "@linaria/core"

import { borderColor } from "../../Calendar.css"

import { vars } from "@/lib"

export const agendaView = css`
	height: 100%;
	padding: ${ vars.spacing.md };
`

export const dayGroup = css`
	margin-bottom: ${ vars.spacing.md };
	
	&:last-child {
		margin-bottom: 0;
	}
`

export const stuck = css`
	border-bottom: 1px solid ${ borderColor };
`

export const dayHeader = css`
	position: sticky;
	top: calc(0px - ${ vars.spacing.sm });
	z-index: 5;
	background-color: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[8] });
	color: var(--mantine-color-text);
	padding-top: ${ vars.spacing.xs };
	padding-bottom: ${ vars.spacing.xs };
	padding-left: ${ vars.spacing.md };
	padding-right: ${ vars.spacing.md };
	margin-bottom: ${ vars.spacing.md };
	margin-left: calc(0px - ${ vars.spacing.md });
	margin-right: calc(0px - ${ vars.spacing.md });
	font-size: ${ vars.fontSizes.lg };
	font-weight: 500;

	&.unstuck {
		border-bottom: 1px solid ${ borderColor };
	}
`

export const eventItem = css`
	padding: ${ vars.spacing.xs } ${ vars.spacing.md };
	margin-bottom: ${ vars.spacing.xs };
	border-radius: var(--mantine-radius-md);
	background-color: var(--mantine-color-default);
	border-left: 4px solid var(--mantine-color-blue-filled);
	transition: all 0.2s ease;

	&:hover {
		transform: translateX(2px);
		box-shadow: var(--mantine-shadow-sm);
	}

	&.all-day {
		background-color: var(--mantine-color-blue-light);
	}
`

export const eventTime = css`
	color: var(--mantine-color-dimmed);
	font-size: var(--mantine-font-size-sm);
	margin-bottom: ${ vars.spacing.xxs };
`

export const eventContent = css`
	.title {
		font-size: var(--mantine-font-size-sm);
	}
`

export const timeSlot = css`
	padding: ${ vars.spacing.xs } ${ vars.spacing.md };
	border-bottom: 1px solid var(--mantine-color-default-border);
	color: var(--mantine-color-dimmed);
	font-size: var(--mantine-font-size-sm);
`
