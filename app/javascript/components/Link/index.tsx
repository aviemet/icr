import React, { forwardRef } from 'react'
import { InertiaLink, InertiaLinkProps } from '@inertiajs/inertia-react'
// import { Button } from '@mui/material'

const Link = forwardRef<HTMLAnchorElement, InertiaLinkProps>(({ children, as = 'a', method, ...props }, ref) => {
	// Only present standard GET requests as anchor tags, all others as buttons
	as = (method !== undefined && method !== 'get') ? 'button' : as

	const asButton = as === 'button'
	return (
		<InertiaLink { ...props } as={ asButton ? 'a' : as }>
			{ asButton ? <button>{ children }</button> : children }
		</InertiaLink>
	)
})

export default Link
