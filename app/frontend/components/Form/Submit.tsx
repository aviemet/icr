import { Flex, type ButtonProps } from "@mantine/core"
import React from "react"

import { Button, Link } from "@/components"

import { useSlotProps } from "./formFieldUtils"

export interface SubmitProps extends ButtonProps {
	children: React.ReactNode
	cancelRoute?: string
	ref?: React.Ref<HTMLButtonElement>
}

export function Submit({
	children,
	cancelRoute,
	style,
	ref,
	...props
}: SubmitProps) {
	const slotProps = useSlotProps()

	return (
		<Flex gap="md" className="submit">
			<Button
				type="submit"
				disabled={ slotProps?.processing }
				style={ [{ flex: 1 }, style] }
				ref={ ref }
				{ ...props }
			>
				{ slotProps?.processing ? "Saving..." : children }
			</Button>
			{ cancelRoute && (
				<Link mt={ 10 } href={ cancelRoute } as="button">Cancel</Link>
			) }
		</Flex>
	)
}
