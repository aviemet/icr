import { vars, theme } from '@/lib/theme'
import { darken, lighten } from '@mantine/core'
import { css } from '@linaria/core'

const fieldsetAlphaAdjustment = 0.125

export const form = css`
	max-width: ${vars.breakpoints.md};

	form.format-grid {
		.field {
			@media (min-width: ${vars.breakpoints.sm}) {
				&:not(.textarea, .checkbox, .compact) {
					&:not(.no-grid) {
						display: grid;
					}
					grid-template-columns: ${theme.other.form.label.width} 1fr;
					grid-template-rows: 1fr;
					border-left-width: 2px;
				}
			}

			&:not(.checkbox) {
				label {
					padding: 0.5rem 0.75rem;
				}
			}
		}
	}

	.field {
		${vars.lightSelector} {
			background-color: ${vars.colors.gray[1]};
		}
		${vars.darkSelector} {
			background-color: ${vars.colors.dark[7]};
		}
		width: 100%;
		border-color: ${vars.colors.primaryColors[2]};
		border-top-width: 2px;

		&:not(.mantine-Grid-root .field) {
			margin-top: ${vars.spacing.xs};
		}

		&.required {
			border-color: ${vars.colors.primaryColors[8]};
		}

		&.field_with_errors {
			border-color: ${vars.colors.red[6]};
		}

		& > label {
			display: block;

			&.text {
				text-align: left;
				width: 100%;
				border-top-left-radius: ${vars.spacing.xs};
				border-top-right-radius: ${vars.spacing.xs};

				& + textarea {
					border-top-left-radius: 0;
					border-top-right-radius: 0;
				}
			}
		}
		// On Desktop use a 2 column grid to show labels and inputs; with feedback elements below input
		@media (min-width: ${vars.breakpoints.sm}) {
			&:not(.textarea, .compact) {
				border-top-width: 0;
				border-left-width: 0;

				& > label, & > legend {
					flex: 1 1 0%;
					text-align: right;
					max-width: ${theme.other.form.label.width};
					grid-row-start: span 2;
				}
			}
		}
	}

	button[type=submit] {
		margin-top: ${vars.spacing.xs};
	}
`

export const fieldset = css`
	margin-top: ${vars.spacing.xs};
	padding: 10;
	position: relative;

	${vars.lightSelector} {
		border-top: 2px solid ${vars.colors.white};
		background-color: ${darken(vars.colors.white, fieldsetAlphaAdjustment)};
	}

	${vars.darkSelector} {
		border-top: 2px solid ${vars.colors.black};
		background-color: ${lighten(vars.colors.black, fieldsetAlphaAdjustment)};
	}

	&:has(legend) {
		margin-top: 2rem;
	}

	legend {
		position: absolute;
		top: -1.75rem;
		display: inline-block;

	${vars.lightSelector} {
		color: ${vars.colors.black};
	}
	
	${vars.darkSelector} {
			color: ${vars.colors.white};
		}
	}

	.field {
		flex: 1;
	}
`

export const dynamicInputItem = css`
	.mantine-Paper-root {
		${vars.lightSelector} {
			background-color: ${vars.colors.gray[0] }
		}

		${vars.darkSelector} {
			background-color: ${vars.colors.gray[8] }
		}
	}
`
