import React from 'react'
import Breadcrumbs, { type TBreadcrumb } from '@/Components/Breadcrumbs'
import { Head } from '@inertiajs/react'

interface IPageProps {
	children?: React.ReactNode
	title?: string
	breadcrumbs?: TBreadcrumb[]
	meta?: React.ReactNode
}

const Page = ({ children, title, meta, breadcrumbs }: IPageProps) => {
	return (
		<>
			{ title && <Head title={ title }>
				{ meta && meta }
			</Head> }
			{ breadcrumbs && <Breadcrumbs crumbs={ breadcrumbs } /> }
			{ children }
		</>
	)
}

export default Page
