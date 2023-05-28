import React, { forwardRef } from 'react'
import normalizeUrl from 'normalize-url'
import { ExternalLinkIcon } from '@/Components/Icons'
import { Anchor, type AnchorProps } from '@mantine/core'
import useLinkStyles from './useLinkStyles'
import cx from 'clsx'

interface IExternalLinkProps extends Omit<AnchorProps, 'component'> {
	href: string
	as?: 'a'|'button'
}

const ExternalLink = forwardRef<HTMLAnchorElement, IExternalLinkProps>((
	{ children, href, as, className, ...props },
	ref,
) => {
	const url = normalizeUrl(href, { stripWWW: false })
	const { classes } = useLinkStyles()

	return (
		<Anchor
			href={ url }
			target="_blank"
			rel="noreferrer"
			className={ cx(classes.external, className ) }
			ref={ ref }
			{ ...props }
		>
			{ children }
			<ExternalLinkIcon className="external" />
		</Anchor>
	)
})

export default ExternalLink
