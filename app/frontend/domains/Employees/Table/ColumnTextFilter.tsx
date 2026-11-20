import { ActionIcon, TextInput } from "@mantine/core"

import { CrossIcon, SearchIcon } from "@/components/Icons"

export function ColumnTextFilter({
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
