import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const root = css`
	min-width: 0;
	max-width: 100%;

	.mantine-Switch-track {
		--switch-bg: light-dark(${ vars.colors.gray[4] }, ${ vars.colors.dark[8] });
		border: 1px solid light-dark(${ vars.colors.gray[5] }, ${ vars.colors.dark[3] });
	}

	.mantine-Switch-input:checked + .mantine-Switch-track {
		--switch-bg: var(--switch-color);
		border-color: transparent;
	}
`
