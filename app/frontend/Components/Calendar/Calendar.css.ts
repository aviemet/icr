import { vars } from "@/lib/theme"
import { css } from "@linaria/core"

export const newShiftButton = css`
	z-index: 100;
	height: auto;
	float: left;
`

export const calendar = css`
	height: 90vh;

	.rbc-date-cell {
		.${newShiftButton} {
			display: none;
			margin-top: 3px;
			margin-left: 3px;
		}

		&:hover {					
			.${newShiftButton} {
				display: block;
			}
		}
	}

	.rbc-toolbar {
		.rbc-btn-group {

		}

		.rbc-toolbar-label {

		}

		.rbc-btn-group {
			button.rbc-active {

			}
		}

		button {
			border-color: ${vars.colors.gray[6]};
		}
	}

	.rbc-month-view {

		.rbc-row-bg {
			/* z-index: 1; */

			.rbc-date-cell {
				border-right: 1px solid ${vars.colors.gray[6]};
				
				&:last-child {
					border-right: none;
				}

				.rbc-day-bg {
				}
			}
		}

		.rbc-month-row {
			overflow: unset;

			.rbc-row-content {
				min-height: 145px;

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

	.rbc-time-view {
		.rbc-time-header {
			.rbc-time-header-content {
				border-color: ${vars.colors.gray[7]};
				border-left-color: ${vars.colors.gray[7]};
				border-bottom-color: ${vars.colors.gray[7]};

				.rbc-header {
					border-color: ${vars.colors.gray[7]};
					border-left-color: ${vars.colors.gray[7]};
					border-bottom-color: ${vars.colors.gray[6]};
				}
			}
		}

		.rbc-time-content {
			border-color: ${vars.colors.gray[6]};
			border-top-color: ${vars.colors.gray[6]};
			border-bottom-color: ${vars.colors.gray[6]};
			
			.rbc-day-slot {
				.rbc-timeslot-group {
					border-color: ${vars.colors.gray[6]};
					border-left-color: ${vars.colors.gray[6]};
				}
			}
		}
	}

	.rbc-event-content {
		font-size: ${vars.fontSizes.xs};
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
