import { Flex, type ButtonProps } from "@mantine/core"
import React, { forwardRef } from "react"
import { Submit as SubmitButton } from "use-inertia-form"

import { Button, Link } from "@/components"

interface SubmitButtonProps extends ButtonProps {
	cancelRoute?: string
	requiredFields?: string[]
}

const Submit = forwardRef<HTMLButtonElement, SubmitButtonProps>((
	{ children, cancelRoute, style, ...props },
	ref,
) => {
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
})

export default Submit
