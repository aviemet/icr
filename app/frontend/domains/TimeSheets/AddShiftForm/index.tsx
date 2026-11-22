import { router } from "@inertiajs/react"
import dayjs from "dayjs"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"

import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { SplitDateTimeInput } from "@/components/Inputs"
import { CategoriesDropdown, ClientsDropdown } from "@/components/Inputs/Dropdowns"
import { useModalContext } from "@/components/Modal"
import { categorySlug, Routes } from "@/lib"
import { nearestHalfHour } from "@/lib/dates"
import { useCreateCalendarEvent } from "@/queries/calendarEvents/mutations"

type AddShiftFormData = {
	client_id: string
	category_id: string
	starts_at: string
	ends_at: string
}

const modalPickerPopoverProps = { withinPortal: true, zIndex: 400 }

export interface AddShiftFormProps {
	employeeId: string
	payPeriodId: string
	periodDates: [Date, Date]
}

function defaultShiftTimes(periodStart: Date, periodEnd: Date) {
	const startBound = dayjs(periodStart).startOf("day")
	const endBound = dayjs(periodEnd).endOf("day")
	let start = dayjs(nearestHalfHour())

	if(start.isBefore(startBound)) {
		start = startBound.hour(9).minute(0).second(0).millisecond(0)
	}
	if(start.isAfter(endBound)) {
		start = endBound.hour(9).minute(0).second(0).millisecond(0)
	}

	return {
		starts_at: start.toISOString(),
		ends_at: start.add(8, "hours").toISOString(),
	}
}

export function AddShiftForm({
	employeeId,
	payPeriodId,
	periodDates,
}: AddShiftFormProps) {
	const { t } = useTranslation()
	const { close } = useModalContext()
	const [periodStart, periodEnd] = periodDates
	const createEvent = useCreateCalendarEvent()

	const initialData = useMemo<AddShiftFormData>(() => {
		const times = defaultShiftTimes(periodStart, periodEnd)
		return {
			client_id: "",
			category_id: categorySlug("Shift", "Regular"),
			starts_at: times.starts_at,
			ends_at: times.ends_at,
		}
	}, [periodStart, periodEnd])

	const submitWith = useCallback(
		(data: AddShiftFormData) => {
			if(!data.client_id) {
				return Promise.reject(new Error("Client is required"))
			}

			return createEvent.mutateAsync({
				calendar_event: {
					category_slug: categorySlug("Calendar::Event", "Shift"),
					starts_at: data.starts_at,
					ends_at: data.ends_at,
					shift_attributes: {
						employee_id: employeeId,
						category_id: data.category_id || categorySlug("Shift", "Regular"),
					},
					event_participants_attributes: [
						{ participant_type: "Client", participant_id: data.client_id },
					],
				},
			}).then(() => {
				close()
				router.get(Routes.periodEmployeeReview(payPeriodId, employeeId))
			})
		},
		[close, createEvent, employeeId, payPeriodId],
	)

	return (
		<Form<AddShiftFormData>
			action={ Routes.periodEmployeeReview(payPeriodId, employeeId) }
			method="post"
			initialData={ initialData }
			submitWith={ submitWith }
			railsAttributes={ false }
		>
			<Grid>
				<Grid.Col span={ 12 }>
					<ClientsDropdown
						name="client_id"
						label={ t("views.timesheets.employee_review.client") }
						required
					/>
				</Grid.Col>
				<Grid.Col span={ 12 }>
					<CategoriesDropdown
						label={ t("views.timesheets.employee_review.shift_type") }
						name="category_id"
						categoryType="Shift"
						valueKey="slug"
						defaultValue={ categorySlug("Shift", "Regular") }
						clearable={ false }
					/>
				</Grid.Col>
				<Grid.Col span={ 12 }>
					<SplitDateTimeInput name="starts_at">
						<Grid>
							<Grid.Col span={ 7 }>
								<SplitDateTimeInput.Date
									label={ t("views.timesheets.employee_review.start_date") }
									popoverProps={ modalPickerPopoverProps }
								/>
							</Grid.Col>
							<Grid.Col span={ 5 }>
								<SplitDateTimeInput.Time
									label={ t("views.timesheets.employee_review.start_time") }
									minutesStep={ 1 }
									popoverProps={ modalPickerPopoverProps }
								/>
							</Grid.Col>
						</Grid>
					</SplitDateTimeInput>
				</Grid.Col>
				<Grid.Col span={ 12 }>
					<SplitDateTimeInput name="ends_at">
						<Grid>
							<Grid.Col span={ 7 }>
								<SplitDateTimeInput.Date
									label={ t("views.timesheets.employee_review.end_date") }
									popoverProps={ modalPickerPopoverProps }
								/>
							</Grid.Col>
							<Grid.Col span={ 5 }>
								<SplitDateTimeInput.Time
									label={ t("views.timesheets.employee_review.end_time") }
									minutesStep={ 1 }
									popoverProps={ modalPickerPopoverProps }
								/>
							</Grid.Col>
						</Grid>
					</SplitDateTimeInput>
				</Grid.Col>
				<Grid.Col span={ 12 }>
					<Submit>{ t("views.timesheets.employee_review.add_shift_submit") }</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
