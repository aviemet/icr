import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const table = css`
	table-layout: fixed;
	color: light-dark(${ vars.colors.gray[8] }, ${ vars.colors.gray[0] });
	border-collapse: separate;
	border-spacing: 0;

	thead tr {
		background-color: light-dark(${ vars.colors.gray[1] }, ${ vars.colors.dark[4] });
	}

	th {
		position: sticky;
		top: 0;
		z-index: 1;
		background-color: light-dark(${ vars.colors.gray[1] }, ${ vars.colors.dark[4] });
		color: light-dark(${ vars.colors.gray[8] }, ${ vars.colors.gray[0] });
		font-size: ${ vars.fontSizes.sm };
		font-weight: 600;
		white-space: nowrap;
		vertical-align: bottom;
	}

	th:first-child,
	td:first-child {
		width: 3.25rem;
		text-align: center;
	}

	th:nth-child(2),
	td:nth-child(2) {
		width: 11.5rem;
	}

	th:nth-child(n + 3),
	td:nth-child(n + 3) {
		width: 4.75rem;
		text-align: center;
	}

	td {
		color: light-dark(${ vars.colors.gray[8] }, ${ vars.colors.gray[0] });
	}

	td .mantine-Switch-root {
		display: inline-flex;
		justify-content: center;
	}

	tbody tr[data-striped="odd"] {
		background-color: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[6] });
	}
`

export const columnHeader = css`
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
	gap: ${ vars.spacing.xs };
	min-height: 3.25rem;
`

export const adminOption = css`
	padding: ${ vars.spacing.xs } ${ vars.spacing.md } ${ vars.spacing.sm };
	border-top: 1px solid light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[3] });
	background-color: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[6] });

	.mantine-Switch-label {
		color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.gray[5] });
		font-size: ${ vars.fontSizes.xs };
	}
`

export const intro = css`
	color: light-dark(${ vars.colors.gray[7] }, ${ vars.colors.gray[2] });
`
