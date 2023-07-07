import React, { forwardRef, useCallback } from 'react'
import { Select, type SelectProps } from '@mantine/core'
import { router } from '@inertiajs/react'
import { coerceArray } from '@/lib'

export interface IDropdownProps extends Omit<SelectProps, 'data'> {
	options?: Array<Record<string, any>>
	getLabel?: (option: Record<string, any>) => any
	getValue?: (option: Record<string, any>) => string
	disabledOptions?: (label: string, value: string | number) => boolean
	onOpen?: () => void
	fetchOnOpen?: string
}

const DropdownComponent = forwardRef<HTMLInputElement, IDropdownProps>((
	{
		options = [],
		getLabel = option => option.name,
		getValue = option => String(option.id),
		disabledOptions,
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

	const data = useCallback(() => {
		if(!options) return []

		return options.map(option => {
			const optionPart = {
				label: getLabel(option),
				value: getValue(option),
				disabled: false,
			}

			if(disabledOptions) {
				optionPart.disabled = disabledOptions(optionPart.label, optionPart.value)
			}

			return optionPart
		})
	}, [options])

	const fetchNewRecords = (query?: string) => {
		if(!fetchOnOpen) return

		router.reload({ only: coerceArray(fetchOnOpen) })

		if(onDropdownOpen) onDropdownOpen()
	}

	return (
		<Select
			ref={ ref }
			id={ inputId }
			name={ name }
			searchable={ searchable }
			clearable={ clearable }
			size="md"
			data={ data() }
			maxDropdownHeight={ 400 }
			nothingFound="No Results"
			onDropdownOpen={ fetchNewRecords }
			mt={ mt }
			{ ...props }
		/>
	)
})

export default React.memo(DropdownComponent)
