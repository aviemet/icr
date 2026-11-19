import { SegmentedControl } from "@mantine/core"

import { Badge, Page, Section, Text, Title } from "@/components"
import { type Breadcrumb } from "@/components/Breadcrumbs"

import * as classes from "./StatusDesk.css"

export interface StatusDeskOption {
	value: string
	label: string
}

export interface StatusDeskProps {
	title: string
	breadcrumbs: Breadcrumb[]
	heading: string
	statusLabel: string
	transitionLabel: string
	options: StatusDeskOption[]
	value: string
	onChange: (value: string) => void
	children: React.ReactNode
}

export function StatusDesk({
	title,
	breadcrumbs,
	heading,
	statusLabel,
	transitionLabel,
	options,
	value,
	onChange,
	children,
}: StatusDeskProps) {
	return (
		<Page title={ title } breadcrumbs={ breadcrumbs }>
			<Section>
				<div className={ classes.desk }>
					<div className={ classes.hero }>
						<div>
							<Title order={ 2 }>{ heading }</Title>
							<Text size="sm" c="dimmed" mt={ 4 }>Current status</Text>
						</div>
						<Badge size="lg">{ statusLabel }</Badge>
					</div>

					<div className={ classes.picker }>
						<Text size="sm" fw={ 600 }>{ transitionLabel }</Text>
						<SegmentedControl
							fullWidth
							value={ value }
							onChange={ onChange }
							data={ options }
						/>
					</div>

					<div className={ classes.formCanvas }>
						{ children }
					</div>
				</div>
			</Section>
		</Page>
	)
}
