import { css } from "@linaria/core"

import { vars } from "@/lib"

export const colorPickerContainer = css`
	position: relative;
	width: fit-content;
`

export const colorPicker = css`
	--cp-thumb-size: 1.5rem;

	&.withPreview .mantine-ColorPicker-slider {
		width: calc(var(--cp-width) - ${ vars.spacing.lg } * 2.5);
	}
`

export const colorSwatch = css`
	position: absolute;
	right: 0;
	bottom: 0;
`
