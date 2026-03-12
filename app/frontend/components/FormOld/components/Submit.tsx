import { Flex, type ButtonProps } from "@mantine/core"
import React from "react"
import { Submit as SubmitButton } from "use-inertia-form"

import { Button, Link } from "@/components"

interface SubmitButtonProps extends ButtonProps {
	ref?: React.Ref<HTMLButtonElement>
	cancelRoute?: string
	requiredFields?: string[]
}

export function Submit({
	children,
	cancelRoute,
	style,
	ref,
	...props
}: SubmitButtonProps) {
	return (
		<Flex gap="md" className="submit">
			<Button
				component={ SubmitButton }
				style={ [{ flex: 1 }, style] }
				ref={ ref }
				{ ...props }
			>
				{ children }
			</Button>
			{ cancelRoute && (
				<Link mt={ 10 } href={ cancelRoute } as="button">Cancel</Link>
			) }
		</Flex>
	)
}
