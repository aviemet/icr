import { Button, Grid, Select } from "@mantine/core"
import { DateInput } from "@mantine/dates"
import { useTranslation } from "react-i18next"

export function TimesheetFilters() {
	const { t } = useTranslation()

	return (
		<Grid align="flex-end">
			<Grid.Col span={ 3 }>
				<DateInput
					label={ t("views.timesheets.filters.date_from") }
					placeholder={ t("views.timesheets.filters.select_date") }
					clearable
				/>
			</Grid.Col>
			<Grid.Col span={ 3 }>
				<DateInput
					label={ t("views.timesheets.filters.date_to") }
					placeholder={ t("views.timesheets.filters.select_date") }
					clearable
				/>
			</Grid.Col>
			<Grid.Col span={ 3 }>
				<Select
					label={ t("views.timesheets.filters.status") }
					placeholder={ t("views.timesheets.filters.select_status") }
					data={ [
						{ value: "draft", label: t("views.timesheets.status.draft") },
						{ value: "submitted", label: t("views.timesheets.status.submitted") },
						{ value: "approved", label: t("views.timesheets.status.approved") },
						{ value: "rejected", label: t("views.timesheets.status.rejected") },
					] }
					clearable
				/>
			</Grid.Col>
			<Grid.Col span={ 3 }>
				<Button fullWidth>{ t("views.timesheets.filters.apply") }</Button>
			</Grid.Col>
		</Grid>
	)
}
