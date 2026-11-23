import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

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
