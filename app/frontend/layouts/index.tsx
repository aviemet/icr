import { Flash } from "@/components"
import Providers from "@/layouts/Providers"

import BareAppLayout from "./AppLayout"
import BareAuthLayout from "./AuthLayout"
import BarePublicLayout from "./PublicLayout"
import BareSettingsLayout from "./SettingsLayout"

export const LAYOUTS = {
	"auth": "auth",
	"app": "app",
	"settings": "settings",
	"public": "public",
} as const

export interface LayoutProps {
	children: any
}

export const LayoutWrapper = ({ children }: LayoutProps) => {
	return (
		<Providers>
			<Flash />
			{ children }
		</Providers>
	)
}

export const AuthLayout = ({ children }: LayoutProps) => {
	return (
		<LayoutWrapper>
			<BareAuthLayout>
				{ children }
			</BareAuthLayout>
		</LayoutWrapper>
	)
}

export const AppLayout = ({ children }: LayoutProps) => {
	return (
		<LayoutWrapper>
			<BareAppLayout>
				{ children }
			</BareAppLayout>
		</LayoutWrapper>
	)
}

export const SettingsLayout = ({ children }: LayoutProps) => {
	return (
		<LayoutWrapper>
			<BareSettingsLayout>
				{ children }
			</BareSettingsLayout>
		</LayoutWrapper>
	)
}

export const PublicLayout = ({ children }: LayoutProps) => {
	return (
		<LayoutWrapper>
			<BarePublicLayout>
				{ children }
			</BarePublicLayout>
		</LayoutWrapper>
	)
}

