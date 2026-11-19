import clsx from "clsx"

import { Box, Page, Title } from "@/components"
import { type Breadcrumb } from "@/components/Breadcrumbs"
import { NewIcon } from "@/components/Icons"
import { pageChrome } from "@/components/PageChrome"

import * as classes from "./RecordFormPage.css"

export interface RecordFormPageProps {
	title: string
	description?: string
	breadcrumbs?: Breadcrumb[]
	actions?: React.ReactNode
	icon?: React.ReactNode
	children: React.ReactNode
}

export function RecordFormPage({
	title,
	description,
	breadcrumbs,
	actions,
	icon,
	children,
}: RecordFormPageProps) {
	return (
		<Page title={ title } breadcrumbs={ breadcrumbs }>
			<Box className={ classes.page }>
				<header className={ clsx(pageChrome.panelSurface, classes.header) }>
					<Box className={ classes.identity }>
						<Box className={ classes.identityRow }>
							<span className={ pageChrome.iconBadge }>
								{ icon ?? <NewIcon size={ 16 } /> }
							</span>
							<Title order={ 2 }>{ title }</Title>
						</Box>
						{ description && <span className={ classes.description }>{ description }</span> }
					</Box>
					{ actions && <Box className={ classes.actions }>{ actions }</Box> }
				</header>
				<Box className={ classes.canvas }>
					{ children }
				</Box>
			</Box>
		</Page>
	)
}
