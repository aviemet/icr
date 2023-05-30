import React from 'react'
import { Breadcrumbs as MantineBreadcrumbs, type BreadcrumbsProps, Portal } from '@mantine/core'
import { Link } from '@/Components'

export type TBreadcrumb = {
	title: string
	href?: string
}

export const breadcrumbLinks = (links: TBreadcrumb[]) => links.map((link, i) => link.href ?
	<Link external={ false } href={ link.href } key={ i }>{ link.title }</Link>
	:
	<React.Fragment key={ i }>{ link.title }</React.Fragment>,
)

interface IBreadcrumbsProps extends Omit<BreadcrumbsProps, 'children'> {
	crumbs?: TBreadcrumb[]
	children?: React.ReactNode
}

const Breadcrumbs = ({ crumbs, children, separator = '>', ...props }: IBreadcrumbsProps) => {
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
