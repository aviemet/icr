import clsx from "clsx"

import { Page, Title } from "@/components"
import { type Breadcrumb } from "@/components/Breadcrumbs"
import { pageChrome } from "@/components/PageChrome"

import * as classes from "./RecordFormPage.css"

export interface RecordFormPageProps {
	title: string
	description?: string
	breadcrumbs?: Breadcrumb[]
	actions?: React.ReactNode
	children: React.ReactNode
}

export function RecordFormPage({
	title,
	description,
	breadcrumbs,
	actions,
	children,
}: RecordFormPageProps) {
	return (
		<Page title={ title } breadcrumbs={ breadcrumbs }>
			<div className={ classes.page }>
				<header className={ clsx(pageChrome.panelSurface, classes.header) }>
					<div className={ classes.identity }>
						<Title order={ 2 }>{ title }</Title>
						{ description && <span className={ classes.description }>{ description }</span> }
					</div>
					{ actions && <div className={ classes.actions }>{ actions }</div> }
				</header>
				<div className={ classes.canvas }>
					{ children }
				</div>
			</div>
		</Page>
	)
}
