import { css } from "@linaria/core"

export const table = css`
	th {
		white-space: nowrap;
	}

	th,
	td {
		vertical-align: middle;
	}

	th:last-child,
	td:last-child {
		padding-right: 14px;
	}

	th.actionsCell,
	td.actionsCell {
		width: 1%;
		white-space: nowrap;
		text-align: center;

		& > * {
			width: fit-content;
			max-width: 100%;
			margin-inline: auto;
		}
	}
`

export const header = css`
	th {
		cursor: pointer;
		user-select: none;
	}
`

export const root = css`
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
`

export const avatarSelectionColumn = css`
	width: 1%;
	white-space: nowrap;
	padding-inline: 8px;
`

export const avatarCheckbox = css`
	display: flex;
	align-items: center;
	justify-content: center;
`

export const selectionAvatar = css`
	cursor: pointer;
	width: 2rem;
	height: 2rem;
	min-width: 2rem;
	transition: box-shadow 120ms ease;
`

export const selectionAvatarInitials = css`
	display: block;
	transform: translateY(1px);
`

export const selectionAvatarSelected = css`
	box-shadow: 0 0 0 2px var(--mantine-primary-color-filled);
`
