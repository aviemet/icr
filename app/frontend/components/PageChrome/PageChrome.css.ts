import { css } from "@linaria/core"

import { theme, vars } from "@/lib/theme"

export const pageShell = css`
	width: 100%;
	max-width: ${ theme.other.page.maxWidth };
	margin-inline: auto;
`

export const pageStack = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.lg };
`

export const fieldTokens = css`
	--icr-field-bg: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[8] });
	--icr-field-border: light-dark(${ vars.colors.gray[4] }, ${ vars.colors.dark[3] });
`

export const panelSurface = css`
	--icr-field-bg: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[8] });
	--icr-field-border: light-dark(${ vars.colors.gray[4] }, ${ vars.colors.dark[3] });

	padding: ${ vars.spacing.md };
	border-radius: ${ vars.radius.md };
	border: 1px solid light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[4] });
	background-color: light-dark(${ vars.colors.white }, ${ vars.colors.dark[5] });
	box-shadow: light-dark(
		0 1px 2px color-mix(in srgb, ${ vars.colors.dark[9] } 6%, transparent),
		0 1px 3px color-mix(in srgb, ${ vars.colors.black } 40%, transparent)
	);
`
