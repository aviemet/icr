import React from 'react'
import { InertiaLink } from '@inertiajs/inertia-react'

const Button: React.FC = ({ children }) => <button>{ children }</button>

interface LinkProps {
	children?: any,
	as?: string,
	data?: object,
	href: string,
	method?: string,
	preserveScroll?: boolean,
	preserveState?: null | boolean,
	replace?: boolean,
	only?: Array<string>,
	headers?: object,
	className?: string,
	id?: string,
	buttonProps?: object,
	rest?: any
}

const Link = ({ children, as = 'a', href, buttonProps, ...props }: LinkProps) => {
	let asProp = as
	if(props.method !== undefined && props.method !== 'get'){
		asProp = 'button'
	}

	const asButton = asProp === 'button'
	return (
		<InertiaLink href={ href } { ...props } type={ asButton ? 'button' : undefined }>{
			asButton ? <Button { ...buttonProps }>{ children }</Button> : children
		}</InertiaLink>
	)
}

export default Link
