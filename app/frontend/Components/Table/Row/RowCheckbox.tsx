import React from 'react'
import Td from '../Td'
import { Checkbox } from '@mantine/core'
import { useTableContext } from '../TableContext'
import cx from 'clsx'

interface RowCheckBox {
	name: string
	selected: Set<string>
}

const RowCheckbox = ({ name, selected }: RowCheckBox) => {
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
		<Td fitContent className={ cx('table-row-select-checkbox') }>
			<Checkbox checked={ selected?.has(name) } onChange={ handleClick } />
		</Td>
	)
}

export default RowCheckbox
