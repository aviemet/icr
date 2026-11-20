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

export const panelFill = css`
	border-radius: ${ vars.radius.md };
	border: 1px solid light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[4] });
	background-color: light-dark(${ vars.colors.white }, ${ vars.colors.dark[6] });
	box-shadow: light-dark(
		0 1px 2px color-mix(in srgb, ${ vars.colors.dark[9] } 6%, transparent),
		0 1px 3px color-mix(in srgb, ${ vars.colors.black } 40%, transparent)
	);
`

export const panelWrapperFill = css`
	border-radius: ${ vars.radius.md };
	border: 1px solid light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[4] });
	background-color: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[7] });
	box-shadow: light-dark(
		0 1px 2px color-mix(in srgb, ${ vars.colors.dark[9] } 6%, transparent),
		0 1px 3px color-mix(in srgb, ${ vars.colors.black } 40%, transparent)
	);
`

export const panelSurface = css`
	--icr-field-bg: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[8] });
	--icr-field-border: light-dark(${ vars.colors.gray[4] }, ${ vars.colors.dark[3] });

	padding: ${ vars.spacing.md };
	border-radius: ${ vars.radius.md };
	border: 1px solid light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[4] });
	background-color: light-dark(${ vars.colors.white }, ${ vars.colors.dark[6] });
	box-shadow: light-dark(
		0 1px 2px color-mix(in srgb, ${ vars.colors.dark[9] } 6%, transparent),
		0 1px 3px color-mix(in srgb, ${ vars.colors.black } 40%, transparent)
	);
`

export const panelWrapperSurface = css`
	--icr-field-bg: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[8] });
	--icr-field-border: light-dark(${ vars.colors.gray[4] }, ${ vars.colors.dark[3] });

	padding: ${ vars.spacing.md };
	border-radius: ${ vars.radius.md };
	border: 1px solid light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[4] });
	background-color: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[7] });
	box-shadow: light-dark(
		0 1px 2px color-mix(in srgb, ${ vars.colors.dark[9] } 6%, transparent),
		0 1px 3px color-mix(in srgb, ${ vars.colors.black } 40%, transparent)
	);
`

export const iconBadge = css`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1.85rem;
	height: 1.85rem;
	border-radius: ${ vars.radius.sm };
	flex: 0 0 auto;
	color: ${ vars.colors.primaryColors.filled };
	background-color: light-dark(
		color-mix(in srgb, ${ vars.colors.primaryColors[1] } 75%, ${ vars.colors.white }),
		color-mix(in srgb, ${ vars.colors.primaryColors.filled } 22%, ${ vars.colors.dark[6] })
	);
`

export const tintedSurface = css`
	padding: ${ vars.spacing.sm } ${ vars.spacing.md };
	border-radius: ${ vars.radius.md };
	border: 1px solid light-dark(
		color-mix(in srgb, ${ vars.colors.primaryColors.filled } 22%, ${ vars.colors.gray[3] }),
		color-mix(in srgb, ${ vars.colors.primaryColors.filled } 28%, ${ vars.colors.dark[4] })
	);
	background-color: light-dark(
		color-mix(in srgb, ${ vars.colors.primaryColors[0] } 55%, ${ vars.colors.white }),
		color-mix(in srgb, ${ vars.colors.primaryColors.filled } 12%, ${ vars.colors.dark[6] })
	);
`
