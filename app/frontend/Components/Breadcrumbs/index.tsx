import React from 'react'
import { Breadcrumbs as MantineBreadcrumbs,
	type BreadcrumbsProps as MantineBreadcrumbsProps,
	Portal,
} from '@mantine/core'
import { Link } from '@/Components'

export type Breadcrumb = {
	title: string
	href?: string
}

export const breadcrumbLinks = (links:Breadcrumb[]) => links.map((link, i) => link.href ?
	<Link external={ false } href={ link.href } key={ i }>{ link.title }</Link>
	:
	<React.Fragment key={ i }>{ link.title }</React.Fragment>,
)

interface BreadcrumbsProps extends Omit<MantineBreadcrumbsProps, 'children'> {
	crumbs?:Breadcrumb[]
	children?: React.ReactNode
}

const Breadcrumbs = ({ crumbs, children, separator = '>', ...props }: BreadcrumbsProps) => {
	return (
		<Portal target="#footer-portal">
			<MantineBreadcrumbs separator={ separator } { ...props }>
				{ crumbs && breadcrumbLinks(crumbs) }
				{ children && children }
			</MantineBreadcrumbs>
		</Portal>
	)
}

export default Breadcrumbs
