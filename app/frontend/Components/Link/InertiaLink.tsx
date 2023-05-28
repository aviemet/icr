import React, { forwardRef } from 'react'
import { Link, router, type InertiaLinkProps } from '@inertiajs/react'
import { Method, Visit } from '@inertiajs/core'
import { Anchor, type AnchorProps, type ButtonProps } from '@mantine/core'
import { Button } from '@/Components'
import { omit } from 'lodash'

interface ILinkProps extends Omit<InertiaLinkProps, 'color'|'size'|'span'>, Omit<AnchorProps, 'href'> {
	children?: React.ReactNode
	href: string
	as: 'a'|'button'
	method?: Method
	visit?: Omit<Visit, 'method'>
	compact?: boolean
	buttonProps?: ButtonProps
	disabled?: boolean
}

const InertiaLinkComponent = forwardRef<HTMLAnchorElement, ILinkProps>((
	{ children, href, as = 'a', method, visit, compact, color, disabled, buttonProps, ...props },
	ref,
) => {
	const handleHTTP = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		router.visit(href, {
			method,
			...visit,
		})
	}

	const finalButtonProps: Partial<ButtonProps> = buttonProps || {}
	if(color) finalButtonProps.color = color
	if(disabled) finalButtonProps.disabled = disabled

	// Only present standard GET requests as anchor tags, all others as buttons
	if(method !== undefined && method !== 'get') {
		const button = <Button { ...finalButtonProps } onClick={ handleHTTP }>{ children }</Button>

		if(disabled) {
			return button
		}

		return (
			<Anchor component={ Link } href={ href } onClick={ e => e.preventDefault() } { ...props }>
				{ button }
			</Anchor>
		)
	}

	const content = as === 'button' ? <Button { ...finalButtonProps } compact={ compact }>{ children }</Button> : children
	if(disabled) {
		return <Anchor { ...omit(props, 'onProgress') }>{ content }</Anchor>
	}

	return (
		<Anchor component={ Link } href={ href } ref={ ref } { ...props }>{ content }</Anchor>
	)
})

export default InertiaLinkComponent
