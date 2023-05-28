import React, { forwardRef } from 'react'
import { type Method, type Visit } from '@inertiajs/core'
import InertiaLink from './InertiaLink'
import ExternalLink from './ExternalLink'
import { type AnchorProps, type ButtonProps } from '@mantine/core'

export interface ILinkProps extends Omit<AnchorProps, 'onClick'|'onProgress'> {
	children?: React.ReactNode
	href: string
	method?: Method
	visit?: Omit<Visit, 'method'>
	external?: boolean
	compact?: boolean
	as?: 'a'|'button'
	onProgress?: React.ReactEventHandler<HTMLAnchorElement>
	target?: string
	rel?: string
	tabIndex?: number
	disabled?: boolean
	buttonProps?: ButtonProps
	preserveScroll?: boolean
}

const externalPrefix = ['http', 'www']

const Link = forwardRef<HTMLAnchorElement, ILinkProps>((
	{ children, href, as = 'a', method, visit, external, onProgress, preserveScroll, ...props },
	ref,
) => {
	let renderExternal = external

	if(external === undefined) {
		externalPrefix.some(prefix => {
			if(href.startsWith(prefix)) {
				renderExternal = true
			}
		})
	}

	if(renderExternal) {
		return <ExternalLink
			href={ href }
			ref={ ref }
			{ ...onProgress }
			{ ...props }
		>
			{ children }
		</ExternalLink>
	}

	return <InertiaLink
		href={ href }
		as={ as }
		method={ method }
		visit={ visit }
		ref={ ref }
		preserveScroll={ preserveScroll }
		{ ...onProgress }
		{ ...props }
	>
		{ children }
	</InertiaLink>
})

export default Link
