import { Select } from "@mantine/core"
import clsx from "clsx"

import { Badge, Page, Section, Text, Title } from "@/components"
import { type Breadcrumb } from "@/components/Breadcrumbs"
import { pageChrome } from "@/components/PageChrome"

import * as classes from "./StatusDesk.css"

export interface StatusDeskOption {
	value: string
	label: string
}

export interface StatusDeskProps {
	title: string
	breadcrumbs: Breadcrumb[]
	heading: string
	meta?: React.ReactNode
	statusLabel: string
	transitionLabel: string
	options: StatusDeskOption[]
	value: string
	onChange: (value: string) => void
	placeholder?: string
	children: React.ReactNode
}

export function StatusDesk({
	title,
	breadcrumbs,
	heading,
	meta,
	statusLabel,
	transitionLabel,
	options,
	value,
	onChange,
	placeholder = "Select an action",
	children,
}: StatusDeskProps) {
	const hasSelection = value !== ""

	return (
		<Page title={ title } breadcrumbs={ breadcrumbs }>
			<Section>
				<div className={ clsx(pageChrome.pageShell, classes.desk) }>
					<div className={ clsx(pageChrome.panelSurface, classes.hero) }>
						<div>
							<Title order={ 2 }>{ heading }</Title>
							{ meta && <div className={ classes.meta }>{ meta }</div> }
						</div>
						<Badge size="lg">{ statusLabel }</Badge>
					</div>

					<div className={ classes.picker }>
						<Text size="sm" fw={ 600 }>{ transitionLabel }</Text>
						<Select
							clearable
							placeholder={ placeholder }
							value={ hasSelection ? value : null }
							onChange={ nextValue => onChange(nextValue ?? "") }
							data={ options }
						/>
					</div>

					{ hasSelection && (
						<div className={ pageChrome.panelSurface }>
							{ children }
						</div>
					) }
				</div>
			</Section>
		</Page>
	)
}
