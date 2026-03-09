import { Link } from "@inertiajs/react"
import { Button, ButtonProps } from "@mantine/core"
import React from "react"

interface IButtonLinkProps
	extends ButtonProps,
	Omit<React.ComponentPropsWithoutRef<typeof Link>, "color" | "size" | "style"> {
	ref?: React.Ref<HTMLAnchorElement>
}

const ButtonLink = ({ ref, ...props }: IButtonLinkProps) => (
	<Button { ...props } ref={ ref } component={ Link } />
)

export default ButtonLink
