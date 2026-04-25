import { Avatar, type AvatarProps } from "@/components"

export interface SiteLogoProps extends AvatarProps,
	Omit<React.ComponentPropsWithoutRef<"div">, keyof AvatarProps | "id"> {}

export function SiteLogo({ ...props }: SiteLogoProps) {
	return (
		<Avatar id="site-logo" { ...props } />
	)
}
