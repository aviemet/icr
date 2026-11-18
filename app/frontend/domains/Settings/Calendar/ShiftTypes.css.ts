import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const panel = css`
	background-color: light-dark(${ vars.colors.white }, ${ vars.colors.dark[5] });
	border-color: light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[3] });
	box-shadow: 0 1px 0 light-dark(
		color-mix(in srgb, ${ vars.colors.black } 4%, transparent),
		color-mix(in srgb, ${ vars.colors.white } 6%, transparent)
	);
`

export const table = css`
	thead tr {
		background-color: light-dark(${ vars.colors.gray[1] }, ${ vars.colors.dark[4] });
	}

	th {
		color: light-dark(${ vars.colors.gray[7] }, ${ vars.colors.gray[3] });
		font-size: ${ vars.fontSizes.sm };
		font-weight: 600;
	}

	tbody tr[data-striped="odd"] {
		background-color: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[6] });
	}
`

export const addForm = css`
	max-width: 28rem;
`
