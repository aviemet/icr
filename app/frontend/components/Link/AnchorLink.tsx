import { Link, type InertiaLinkProps } from "@inertiajs/react"
import { Anchor, type AnchorProps } from "@mantine/core"
import React from "react"

export interface AnchorLinkProps
	extends Omit<InertiaLinkProps, "color" | "size" | "span" | "style" | "component">,
	Omit<AnchorProps, "href" | "component"> {
	ref?: React.Ref<HTMLAnchorElement>
}

export function AnchorLink({ ref, ...props }: AnchorLinkProps) {
	return (
		<Anchor ref={ ref } { ...props } component={ Link } />
	)
}
