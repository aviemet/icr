import { Link, type InertiaLinkProps } from "@inertiajs/react"
import { Anchor, type AnchorProps } from "@mantine/core"
import React from "react"

export interface IAnchorLinkProps
	extends Omit<InertiaLinkProps, "color" | "size" | "span" | "style">,
	Omit<AnchorProps, "href"> {
	ref?: React.Ref<HTMLAnchorElement>
}

const AnchorLink = ({ ref, ...props }: IAnchorLinkProps) => {
	return (
		<Anchor ref={ ref } component={ Link } { ...props } />
	)
}

export default AnchorLink
