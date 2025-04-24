import clsx from "clsx"

import { Checkbox } from "@/components/Inputs"
import { CheckboxProps } from "@/components/Inputs/Checkbox"

import { useTableContext } from "../TableContext"
import Td from "../Td"


interface RowCheckBox extends CheckboxProps {
	name: string
	selected: Set<string>
}

const RowCheckbox = ({ name, selected, ...props }: RowCheckBox) => {
	const { setTableState } = useTableContext()

	const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
		const checked = e.target.checked
		if(checked) {
			selected.add(name)
		} else {
			selected.delete(name)
		}

		setTableState({ selected })
	}

	return (
		<Td fitContent className={ clsx("table-row-select-checkbox") }>
			<Checkbox checked={ selected?.has(name) } onChange={ handleClick } { ...props } />
		</Td>
	)
}

export default RowCheckbox
