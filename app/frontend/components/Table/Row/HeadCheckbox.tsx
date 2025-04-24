import { Checkbox } from "@/components/Inputs"
import { CheckboxProps } from "@/components/Inputs/Checkbox"

import { useTableContext } from "../TableContext"
import Td from "../Td"

interface RowCheckBoxProps extends CheckboxProps {
	selected: Set<string>
	rows?: Record<string, any>[]
	allChecked: boolean
	indeterminate: boolean
}

const HeadCheckbox = ({ selected, rows, allChecked, indeterminate, ...props }: RowCheckBoxProps) => {
	const { setTableState } = useTableContext()

	const handleClick = () => {
		if(!rows || rows.length === 0) return

		if(selected.size === rows.length) {
			selected.clear()
		} else {
			rows.forEach(row => {
				selected.add(String(row.id))
			})
		}

		setTableState({ selected })
	}

	return (
		<Td fitContent>
			<Checkbox
				onChange={ handleClick }
				checked={ allChecked }
				indeterminate={ indeterminate }
				disabled={ rows?.length === 0 }
				{ ...props }
			/>
		</Td>
	)
}

export default HeadCheckbox
