import { vars } from '@/lib/theme'
import { css } from '@linaria/core'

export const calendar = css`
	height: 90vh;

	.rbc-event-content {
		font-size: ${vars.fontSizes.xs}
	}

	.rbc-month-view {

		.rbc-month-row {
			overflow: unset;

			.rbc-row-content {

				&.rbc-row-content-scrollable {
					
					.rbc-row-content-scroll-container {
						overflow-y: unset;

						.rbc-addons-dnd-row-body {

							.rbc-row {

								.rbc-row-segment {

									.rbc-event {
										
									}
								}
							}
						}
					}
				}
			}
		}

	}


	// Fix dark theme colors
	${vars.darkSelector} { 
		.rbc-today {
			background-color: ${vars.colors.cyan[9]};
		}

		.rbc-day-bg.rbc-off-range-bg {
			background-color: ${vars.colors.dark[5]};
		}

		button{
			color: ${vars.colors.white};

			&:hover, &:active, &:focus {
				color: ${vars.colors.white};
				background-color: ${vars.colors.dark[5]};
			}

			&.rbc-active {
				background-color: ${vars.colors.cyan[8]};

				&:hover {
					color: ${vars.colors.white};
				}
			}
		}
	}
	// End fix dark theme colors
`
