import React, { forwardRef } from 'react'
import { InertiaLink, InertiaLinkProps } from '@inertiajs/inertia-react'
import { Button, Link as MuiLink } from '@mui/material'
import { Routes } from '@/lib'
import { Inertia, Method, Visit } from '@inertiajs/inertia'

interface LinkProps extends InertiaLinkProps {
	method?: Method
	visit?: Omit<Visit, 'method'>
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ children, href, as = 'a', method, visit, ...props }, ref) => {
	const handleHTTP = e => {
		Inertia.visit(href, {
			method,
			...visit
		})
	}

	if(method !== undefined && method !== 'get') {
		// Only present standard GET requests as anchor tags, all others as buttons
		as = 'button'

		return (
			<MuiLink href={ href } onClick={ e => e.preventDefault() }>
				<Button onClick={ handleHTTP }>{ children }</Button>
			</MuiLink>
		)
	}

	const asButton = as === 'button'
	return (
		<InertiaLink href={ href } { ...props } as={ asButton ? 'a' : as }>
			{ asButton ? <Button>{ children }</Button> : children }
		</InertiaLink>
	)
})

export default Link


/*

If the method is specified and is not GET, use a button



*/