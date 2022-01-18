import React from 'react'
import { InertiaLink, InertiaLinkProps } from '@inertiajs/inertia-react'
import { Button } from 'components'
import { ButtonProps } from 'components/Button/Button'

export interface LinkProps extends InertiaLinkProps {
	buttonProps?: ButtonProps
}

const Link = ({ children, as = 'a', method, buttonProps, ...props }: LinkProps) => {
	// Only present standard GET requests as anchor tags, all others as buttons
	as = (method !== undefined && method !== 'get') ? 'button' : as

	const asButton = as === 'button'
	return (
		<InertiaLink { ...props } as={ asButton ? 'a' : as }>
			{ asButton ? <Button>{ children }</Button> : children }
		</InertiaLink>
	)
}

export default Link
