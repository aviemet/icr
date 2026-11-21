import { Checkbox, Stack } from "@mantine/core"
import { useTranslation } from "react-i18next"

import { ColumnTextFilter } from "@/domains/Employees/Table/ColumnTextFilter"

export interface TrainingClientOption {
	id: string
	name: string
}

export function ClientFilter({
	options,
	searchValue,
	onSearchChange,
	selectedIds,
	onSelectedIdsChange,
}: {
	options: TrainingClientOption[]
	searchValue: string
	onSearchChange: (value: string) => void
	selectedIds: string[]
	onSelectedIdsChange: (value: string[]) => void
}) {
	const { t } = useTranslation()
	const label = t("views.trainings.index.columns.clients")
	const searchQuery = searchValue.trim().toLowerCase()
	const visibleOptions = searchQuery === ""
		? options
		: options.filter(option => option.name.toLowerCase().includes(searchQuery))

	const allVisibleSelected = visibleOptions.length > 0 &&
		visibleOptions.every(option => selectedIds.includes(option.id))
	const someVisibleSelected = visibleOptions.some(option => selectedIds.includes(option.id)) &&
		!allVisibleSelected

	const toggleAllVisible = () => {
		if(allVisibleSelected) {
			const visibleIds = new Set(visibleOptions.map(option => option.id))
			onSelectedIdsChange(selectedIds.filter(id => !visibleIds.has(id)))
			return
		}

		const nextSelected = new Set(selectedIds)
		for(const option of visibleOptions) {
			nextSelected.add(option.id)
		}
		onSelectedIdsChange([...nextSelected])
	}

	const toggleOption = (optionId: string, checked: boolean) => {
		if(checked) {
			onSelectedIdsChange([...selectedIds, optionId])
			return
		}

		onSelectedIdsChange(selectedIds.filter(selected => selected !== optionId))
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
				label={ t("views.trainings.index.clients_select_all") }
				checked={ allVisibleSelected }
				indeterminate={ someVisibleSelected }
				onChange={ toggleAllVisible }
				disabled={ visibleOptions.length === 0 }
			/>
			{ visibleOptions.map(option => (
				<Checkbox
					key={ option.id }
					label={ option.name }
					checked={ selectedIds.includes(option.id) }
					onChange={ event => toggleOption(option.id, event.currentTarget.checked) }
				/>
			)) }
		</Stack>
	)
}
