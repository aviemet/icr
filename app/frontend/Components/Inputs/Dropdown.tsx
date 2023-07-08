import React, { forwardRef } from 'react'
import { Select, SelectItem, type SelectProps } from '@mantine/core'
import { router } from '@inertiajs/react'
import { coerceArray } from '@/lib'

interface DataItem extends Omit<SelectItem, 'value'> {
	value: string|number
}

export interface IDropdownProps extends Omit<SelectProps, 'data'> {
	data?: DataItem[]
	onOpen?: () => void
	fetchOnOpen?: string
}

const DropdownComponent = forwardRef<HTMLInputElement, IDropdownProps>((
	{
		data,
		id,
		name,
		searchable = true,
		clearable = true,
		fetchOnOpen,
		onDropdownOpen,
		mt = 'md',
		...props
	},
	ref,
) => {
	const inputId = id || name

	const fetchNewRecords = (query?: string) => {
		if(!fetchOnOpen) return

		router.reload({ only: coerceArray(fetchOnOpen) })

		if(onDropdownOpen) onDropdownOpen()
	}

	return (
		<Select
			data={ data?.map(datum => ({ ...datum, value: String(datum.value) })) || [] }
			ref={ ref }
			id={ inputId }
			name={ name }
			searchable={ searchable }
			clearable={ clearable }
			size="md"
			maxDropdownHeight={ 400 }
			nothingFound="No Results"
			onDropdownOpen={ fetchNewRecords }
			mt={ mt }
			{ ...props }
		/>
	)
})

export default React.memo(DropdownComponent)
