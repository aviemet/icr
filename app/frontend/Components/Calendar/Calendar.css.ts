import { vars } from "@/lib/theme"
import { css } from "@linaria/core"

export const newShiftButton = css`
	z-index: 100;
	height: auto;
	float: left;
`

export const shiftTotals = css`
	display: flex;
	justify-content: space-between;
	border-top: 1px solid ${vars.colors.gray[6]};
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
	}

	.rbc-header {
		background-color: ${vars.colors.primaryColors[2]};

		${vars.darkSelector} { 
				background-color: ${vars.colors.primaryColors[9]};
		}
	}

	.rbc-month-view {

		.rbc-row-bg {
			.rbc-date-cell {
				border-right: 1px solid ${vars.colors.gray[6]};
				padding-right: 0;
				
				&:last-child {
					border-right: none;
				}

				.rbc-day-bg {
					/* height: 100%; */
				}
			}
		}

		.rbc-month-row {
			overflow: unset;

			.rbc-row-bg {

				.rbc-today {
					background-color: ${vars.colors.primaryColors[2]};

					${vars.darkSelector} { 
							background-color: ${vars.colors.primaryColors[9]};
					}
				}
			}

			.rbc-row-content {
				min-height: 145px;

				&.rbc-row-content-scrollable {
					
					.rbc-row-content-scroll-container {
						overflow-y: unset;
						margin-bottom: 25px; /* Adds space for billable hours */

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
		.rbc-day-bg.rbc-off-range-bg {
			background-color: ${vars.colors.dark[5]};
		}
	}
	// End fix dark theme colors
`
