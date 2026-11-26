import { Text } from "@mantine/core"
import { type ReactNode } from "react"

import * as classes from "./Presence.css"

type PresenceChild = ReactNode | string | number | boolean | null | undefined

interface PresenceProps {
	children: PresenceChild
	fallback?: ReactNode
}

function isBlank(value: PresenceChild) {
	if(value === null || value === undefined) return true
	if(typeof value === "string") return value.trim() === ""
	if(Array.isArray(value)) return value.length === 0
	return false
}

export function Presence({ children, fallback = "-" }: PresenceProps) {
	if(isBlank(children)) {
		return (
			<Text
				component="span"
				size="sm"
				c="dimmed"
				className={ classes.empty }
			>
				{ fallback }
			</Text>
		)
	}

	if(typeof children === "boolean" || typeof children === "number") {
		return <>{ String(children) }</>
	}

	return <>{ children }</>
}
