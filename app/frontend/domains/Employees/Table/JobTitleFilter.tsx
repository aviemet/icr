import { Checkbox, Stack } from "@mantine/core"
import { useTranslation } from "react-i18next"

import { ColumnTextFilter } from "./ColumnTextFilter"

export function JobTitleFilter({
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
