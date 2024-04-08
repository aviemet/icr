import React from 'react'
import { type ISelectProps } from '@/Components/Inputs/Select'
import { type SelectProps, type InputProps } from '@mantine/core'

declare global {
	type HTTPVerb = 'post' | 'put' | 'get' | 'patch' | 'delete'

	type TInputType = 'button'|'checkbox'|'color'|'currency'|'date'|'datetime-local'|'email'|'file'|'hidden'|'image'|'month'|'number'|'password'|'radio'|'range'|'reset'|'search'|'select'|'submit'|'tel'|'text'|'textarea'|'time'|'url'

	type PaginatedModel<T> = {
		data: T
		pagination: Schema.Pagination
	}

	type FlashMessage = Record<'success' | 'alert' | 'info' | 'warning', string>

}
