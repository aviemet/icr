import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const menuItem = css`
	&.disabled * {
		// color: vars.colors.gray[vars.fn.primaryShade()],
		text-decoration: line-through;

		& input[type=checkbox], & input[type=checkbox]:checked {
			// background-color: vars.colors.gray[vars.fn.primaryShade()],
		}
	}
`
