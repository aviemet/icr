import clsx from "clsx"

import { pageChrome } from "@/components/PageChrome"

import * as classes from "./FormBand.css"

export interface FormBandProps {
	title: string
	description?: string
	children: React.ReactNode
	className?: string
}

export function FormBand({ title, description, children, className }: FormBandProps) {
	return (
		<section className={ clsx(pageChrome.panelSurface, classes.band, className) }>
			<div className={ classes.header }>
				<div className={ classes.title }>{ title }</div>
				{ description && <div className={ classes.description }>{ description }</div> }
			</div>
			<div className={ classes.fields }>{ children }</div>
		</section>
	)
}

export interface FormBandStackProps {
	children: React.ReactNode
	className?: string
}

export function FormBandStack({ children, className }: FormBandStackProps) {
	return (
		<div className={ clsx(classes.stack, className) }>
			{ children }
		</div>
	)
}
