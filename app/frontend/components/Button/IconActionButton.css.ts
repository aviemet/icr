import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const iconAction = css`
	width: 18px !important;
	height: 18px !important;
	min-width: 18px !important;
	min-height: 18px !important;
	padding: 0 !important;
	border: none;
	background-color: transparent;
	color: light-dark(${ vars.colors.dark[6] }, ${ vars.colors.gray[3] });

	&:hover {
		background-color: light-dark(
			${ vars.colors.gray[1] },
			color-mix(in srgb, ${ vars.colors.white } 8%, transparent)
		);
		color: light-dark(${ vars.colors.dark[9] }, ${ vars.colors.white });
	}
`

export const deleteAction = css`
	&:hover {
		color: ${ vars.colors.red[6] };
		background-color: light-dark(
			${ vars.colors.red[0] },
			color-mix(in srgb, ${ vars.colors.red[8] } 28%, transparent)
		);
	}
`
