import { ActionIcon, Checkbox, Stack, TextInput } from "@mantine/core"
import { useTranslation } from "react-i18next"

import { Badge, Group, Link, type TableColumn } from "@/components"
import { EditButton, ScheduleButton } from "@/components/Button"
import { DateTimeFormatter } from "@/components/Formatters"
import { CrossIcon, SearchIcon } from "@/components/Icons"
import { Routes } from "@/lib"

import {
	EMPLOYEE_STATUSES,
	employeeJobTitleName,
	type EmployeeColumnFilters,
	type EmployeeStatus,
} from "./filterEmployees"

function ColumnTextFilter({
	label,
	placeholder,
	value,
	onChange,
}: {
	label: string
	placeholder: string
	value: string
	onChange: (value: string) => void
}) {
	return (
		<TextInput
			label={ label }
			placeholder={ placeholder }
			leftSection={ <SearchIcon size={ 16 } /> }
			rightSection={ value !== "" && (
				<ActionIcon size="sm" variant="transparent" onClick={ () => onChange("") }>
					<CrossIcon size={ 14 } />
				</ActionIcon>
			) }
			value={ value }
			onChange={ event => onChange(event.currentTarget.value) }
		/>
	)
}

function JobTitleFilter({
	options,
	searchValue,
	onSearchChange,
	selectedTitles,
	onSelectedTitlesChange,
}: {
	options: string[]
	searchValue: string
	onSearchChange: (value: string) => void
	selectedTitles: string[]
	onSelectedTitlesChange: (value: string[]) => void
}) {
	const { t } = useTranslation()
	const label = t("views.employees.table.job_title")
	const searchQuery = searchValue.trim().toLowerCase()
	const visibleOptions = searchQuery === ""
		? options
		: options.filter(option => option.toLowerCase().includes(searchQuery))

	const allVisibleSelected = visibleOptions.length > 0 &&
		visibleOptions.every(option => selectedTitles.includes(option))
	const someVisibleSelected = visibleOptions.some(option => selectedTitles.includes(option)) &&
		!allVisibleSelected

	const toggleAllVisible = () => {
		if(allVisibleSelected) {
			onSelectedTitlesChange(
				selectedTitles.filter(title => !visibleOptions.includes(title)),
			)
			return
		}

		const nextSelected = new Set(selectedTitles)
		for(const option of visibleOptions) {
			nextSelected.add(option)
		}
		onSelectedTitlesChange([...nextSelected])
	}

	const toggleOption = (option: string, checked: boolean) => {
		if(checked) {
			onSelectedTitlesChange([...selectedTitles, option])
			return
		}

		onSelectedTitlesChange(selectedTitles.filter(selected => selected !== option))
	}

	return (
		<Stack gap="xs" maw={ 260 }>
			<ColumnTextFilter
				label={ label }
				placeholder={ label }
				value={ searchValue }
				onChange={ onSearchChange }
			/>
			<Checkbox
				label={ t("views.employees.table.job_title_select_all") }
				checked={ allVisibleSelected }
				indeterminate={ someVisibleSelected }
				onChange={ toggleAllVisible }
				disabled={ visibleOptions.length === 0 }
			/>
			{ visibleOptions.map(option => (
				<Checkbox
					key={ option }
					label={ option }
					checked={ selectedTitles.includes(option) }
					onChange={ event => toggleOption(option, event.currentTarget.checked) }
				/>
			)) }
		</Stack>
	)
}

function StatusFilter({
	selectedStatuses,
	onSelectedStatusesChange,
}: {
	selectedStatuses: EmployeeStatus[]
	onSelectedStatusesChange: (value: EmployeeStatus[]) => void
}) {
	const { t } = useTranslation()
	const options = EMPLOYEE_STATUSES.map(status => ({
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

	const toggleOption = (status: EmployeeStatus, checked: boolean) => {
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

function statusBadgeColor(status: EmployeeStatus) {
	if(status === "employed") return "green"
	if(status === "offered") return "cyan"
	if(status === "applicant") return "blue"
	if(status === "declined") return "gray"
	return "red"
}

type UseEmployeeTableColumnsOptions = {
	serverFiltered: boolean
	filters: EmployeeColumnFilters
	jobTitleOptions: string[]
	setText: (param: string, value: string) => void
	setMulti: (param: string, value: string[]) => void
}

export function useEmployeeTableColumns({
	serverFiltered,
	filters,
	jobTitleOptions,
	setText,
	setMulti,
}: UseEmployeeTableColumnsOptions): TableColumn<Schema.EmployeesIndex>[] {
	const { t } = useTranslation()

	return [
		{
			accessor: "people.first_name",
			title: t("views.employees.table.first_name"),
			sortable: true,
			...(serverFiltered
				? {
					filtering: filters.firstName !== "",
					filter: (
						<ColumnTextFilter
							label={ t("views.employees.table.first_name") }
							placeholder={ t("views.employees.table.first_name") }
							value={ filters.firstName }
							onChange={ value => setText("first_name", value) }
						/>
					),
				}
				: {}),
			render: (employee) => <Link href={ Routes.employee(employee.slug) }>{ employee.person.first_name }</Link>,
		},
		{
			accessor: "people.last_name",
			title: t("views.employees.table.last_name"),
			sortable: true,
			...(serverFiltered
				? {
					filtering: filters.lastName !== "",
					filter: (
						<ColumnTextFilter
							label={ t("views.employees.table.last_name") }
							placeholder={ t("views.employees.table.last_name") }
							value={ filters.lastName }
							onChange={ value => setText("last_name", value) }
						/>
					),
				}
				: {}),
			render: (employee) => <Link href={ Routes.employee(employee.slug) }>{ employee.person.last_name }</Link>,
		},
		{
			accessor: "employee.job_titles.name",
			title: t("views.employees.table.job_title"),
			sortable: true,
			...(serverFiltered
				? {
					filtering: filters.jobTitle !== "" || filters.jobTitles.length > 0,
					filter: (
						<JobTitleFilter
							options={ jobTitleOptions }
							searchValue={ filters.jobTitle }
							onSearchChange={ value => setText("job_title", value) }
							selectedTitles={ filters.jobTitles }
							onSelectedTitlesChange={ value => setMulti("job_titles", value) }
						/>
					),
				}
				: {}),
			render: (employee) => employeeJobTitleName(employee),
		},
		{
			accessor: "status",
			title: t("views.employees.table.status"),
			sortable: true,
			...(serverFiltered
				? {
					filtering: filters.statuses.length > 0,
					filter: (
						<StatusFilter
							selectedStatuses={ filters.statuses }
							onSelectedStatusesChange={ value => setMulti("statuses", value) }
						/>
					),
				}
				: {}),
			render: (employee) => (
				<Badge variant="light" color={ statusBadgeColor(employee.status) } size="sm">
					{ t(`views.employees.table.statuses.${employee.status}`) }
				</Badge>
			),
		},
		{
			accessor: "active_at",
			title: t("views.employees.table.hire_date"),
			sortable: true,
			...(serverFiltered
				? {
					filtering: filters.hireDate !== "",
					filter: (
						<ColumnTextFilter
							label={ t("views.employees.table.hire_date") }
							placeholder={ t("views.employees.table.hire_date") }
							value={ filters.hireDate }
							onChange={ value => setText("active_at", value) }
						/>
					),
				}
				: {}),
			render: (employee) => (
				<DateTimeFormatter format="dateShort" tooltipFormats={ ["fromNow"] }>
					{ employee.active_at }
				</DateTimeFormatter>
			),
		},
		{
			accessor: "number",
			title: t("views.employees.table.number"),
			sortable: true,
			...(serverFiltered
				? {
					filtering: filters.number !== "",
					filter: (
						<ColumnTextFilter
							label={ t("views.employees.table.number") }
							placeholder={ t("views.employees.table.number") }
							value={ filters.number }
							onChange={ value => setText("number", value) }
						/>
					),
				}
				: {}),
			render: (employee) => employee.number ?? "",
		},
		{
			accessor: "actions",
			title: t("views.employees.table.actions"),
			sortable: false,
			render: (employee) => (
				<Group wrap="nowrap" gap="xs">
					<EditButton href={ Routes.editEmployee(employee.slug) } />
					<ScheduleButton href={ Routes.scheduleEmployee(employee.slug) } />
				</Group>
			),
		},
	]
}
