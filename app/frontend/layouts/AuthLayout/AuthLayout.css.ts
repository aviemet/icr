import { css } from "@linaria/core"

import { vars } from "@/lib/css"

export const authLayout = css`
	min-height: 100%;
	background-color: ${ vars.colors.dark[8] };
	background-image: linear-gradient(
		165deg,
		${ vars.colors.dark[9] } 0%,
		${ vars.colors.dark[8] } 42%,
		color-mix(in srgb, ${ vars.colors.blue[9] } 35%, ${ vars.colors.dark[8] }) 100%
	);

	[data-mantine-color-scheme="light"] & {
		background-color: ${ vars.colors.gray[0] };
		background-image: linear-gradient(
			165deg,
			${ vars.colors.blue[0] } 0%,
			${ vars.colors.gray[0] } 45%,
			color-mix(in srgb, ${ vars.colors.blue[1] } 55%, ${ vars.colors.gray[0] }) 100%
		);
	}
`
