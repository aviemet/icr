import clsx from "clsx"

import { Link, type LinkProps } from "../Link"

interface TabLinkProps extends LinkProps {
	position?: undefined | "right"
}

export function TabLink({ position, className, ...props }: TabLinkProps) {
	return (
		<Link { ...props } className={ clsx(className, position) } />
	)
}
