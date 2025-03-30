import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const calendar = css`
	.toastui-calendar-layout {
		&.toastui-calendar-month {
			background-color: ${vars.colors.body};

			.toastui-calendar-day-names {
				border-bottom: 1px solid ${vars.colors.gray[6]};

				&, .toastui-calendar-day-name-item {
					font-size: inherit;
					text-align: center;
				}
			}

			.toastui-calendar-month-daygrid {
				.toastui-calendar-month-week-item {
					.toastui-calendar-weekday {
						
						/* Week Row Grid Container */
						.toastui-calendar-weekday-grid {
							.toastui-calendar-daygrid-cell {
								border: 1px solid ${vars.colors.gray[6]};
							}
						}

						/* Week Row Events Container */
						.toastui-calendar-weekday-events {

						}
					}
				}
			}
		}
	}

	.toastui-calendar-weekday-event-dot+.toastui-calendar-weekday-event-title {
		color: inherit;
		background-color: ${vars.colors.body};
	}

	.toastui-calendar-detail-container {
		background-color: ${vars.colors.body};
	}

	.toastui-calendar-see-more-container {
		background-color: ${vars.colors.body};
		box-shadow: ${vars.shadows.sm};

		.toastui-calendar-see-more {
			.toastui-calendar-see-more-header {
				.toastui-calendar-more-title-date,
				.toastui-calendar-more-title-day {
					color: inherit;
				}
			}

		}
	}

`
