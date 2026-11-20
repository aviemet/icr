import { Checkbox, Stack } from "@mantine/core"
import { useTranslation } from "react-i18next"

import { APPLICANT_STATUSES, type ApplicantStatus } from "./filterApplicants"

export interface StatusFilterProps {
	selectedStatuses: ApplicantStatus[]
	onSelectedStatusesChange: (value: ApplicantStatus[]) => void
}

export function StatusFilter({ selectedStatuses, onSelectedStatusesChange }: StatusFilterProps) {
	const { t } = useTranslation()
	const options = APPLICANT_STATUSES.map(status => ({
		value: status,
		label: t(`views.employees.table.statuses.${status}`),
	}))
	const allSelected = options.length > 0 && selectedStatuses.length === options.length
	const someSelected = selectedStatuses.length > 0 && selectedStatuses.length < options.length

	const toggleAll = () => {
		if(allSelected) {
			onSelectedStatusesChange([])
			return
		}

		onSelectedStatusesChange(options.map(option => option.value))
	}

	const toggleOption = (status: ApplicantStatus, checked: boolean) => {
		if(checked) {
			onSelectedStatusesChange([...selectedStatuses, status])
			return
		}

		onSelectedStatusesChange(selectedStatuses.filter(selected => selected !== status))
	}

	return (
		<Stack gap="xs" maw={ 220 }>
			<Checkbox
				label={ t("views.employees.table.status_select_all") }
				checked={ allSelected }
				indeterminate={ someSelected }
				onChange={ toggleAll }
			/>
			{ options.map(option => (
				<Checkbox
					key={ option.value }
					label={ option.label }
					checked={ selectedStatuses.includes(option.value) }
					onChange={ event => toggleOption(option.value, event.currentTarget.checked) }
				/>
			)) }
		</Stack>
	)
}
