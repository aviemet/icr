import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const manageLink = css`
	font-size: ${ vars.fontSizes.xs };
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
	text-decoration: underline;
	text-underline-offset: 2px;

	&:hover {
		color: light-dark(${ vars.colors.gray[8] }, ${ vars.colors.gray[3] });
	}
`
