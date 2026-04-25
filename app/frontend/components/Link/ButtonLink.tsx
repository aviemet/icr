import { Link } from "@inertiajs/react"
import { Button, ButtonProps } from "@mantine/core"
import React from "react"

export interface ButtonLinkProps
	extends ButtonProps,
	Omit<React.ComponentPropsWithoutRef<typeof Link>, "color" | "size" | "style"> {
	ref?: React.Ref<HTMLAnchorElement>
}

export function ButtonLink({ ref, ...props }: ButtonLinkProps) {
	return (
		<Button { ...props } ref={ ref } component={ Link } />
	)
}
