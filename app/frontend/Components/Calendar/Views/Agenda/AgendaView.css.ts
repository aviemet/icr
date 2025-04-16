import { css } from "@linaria/core"

import { vars } from "@/lib"

export const agendaView = css`
	height: 100%;
	overflow-y: auto;
	padding: ${ vars.spacing.md };
`

export const dayGroup = css`
	margin-bottom: ${ vars.spacing.md };
	
	&:last-child {
		margin-bottom: 0;
	}
`

export const dayHeader = css`
	color: var(--mantine-color-text);
	padding-bottom: ${ vars.spacing.xs };
	margin-bottom: ${ vars.spacing.md };
	font-size: ${ vars.fontSizes.lg };
	font-weight: 500;
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
