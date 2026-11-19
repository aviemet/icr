import clsx from "clsx"

import { Box } from "@/components"
import { pageChrome } from "@/components/PageChrome"

import * as classes from "./FormBand.css"

export interface FormBandProps {
	title: string
	description?: string
	icon?: React.ReactNode
	actions?: React.ReactNode
	children: React.ReactNode
	className?: string
}

export function FormBand({ title, description, icon, actions, children, className }: FormBandProps) {
	return (
		<section className={ clsx(pageChrome.panelSurface, classes.band, className) }>
			<Box className={ clsx(classes.header) }>
				<Box className={ clsx(classes.titleRow) }>
					<Box className={ clsx(classes.titleGroup) }>
						{ icon && <span className={ pageChrome.iconBadge }>{ icon }</span> }
						<Box className={ clsx(classes.title) }>{ title }</Box>
					</Box>
					{ actions }
				</Box>
				{ description && (
					<Box className={ clsx(classes.description, {
						[classes.descriptionIndented]: icon,
					}) }>
						{ description }
					</Box>
				) }
			</Box>
			<Box className={ clsx(classes.fields) }>{ children }</Box>
		</section>
	)
}

export interface FormBandStackProps {
	children: React.ReactNode
	className?: string
}

export function FormBandStack({ children, className }: FormBandStackProps) {
	return (
		<Box className={ clsx(classes.stack, className) }>
			{ children }
		</Box>
	)
}
