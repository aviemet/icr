import { Link, type InertiaLinkProps } from "@inertiajs/react"
import { Anchor, type AnchorProps } from "@mantine/core"
import React, { forwardRef } from "react"

export interface IAnchorLinkProps
	extends Omit<InertiaLinkProps, "color" | "size" | "span" | "style">,
	Omit<AnchorProps, "href"> {

}

const AnchorLink = forwardRef<HTMLAnchorElement, IAnchorLinkProps>((
	props,
	ref,
) => {
	return (
		<Anchor ref={ ref } component={ Link } { ...props } />
	)
})

export default AnchorLink
