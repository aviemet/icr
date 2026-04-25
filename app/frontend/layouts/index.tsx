import { Flash } from "@/components"
import { SpotlightComponent } from "@/features/Spotlight"
import { Providers } from "@/layouts/Providers"

import { AppLayout as BareAppLayout } from "./AppLayout"
import { AuthLayout as BareAuthLayout } from "./AuthLayout"
import { PublicLayout as BarePublicLayout } from "./PublicLayout"
import { SettingsLayout as BareSettingsLayout } from "./SettingsLayout"

import "@/lib/i18n"

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
			<SpotlightComponent />
			<BareAppLayout>
				{ children }
			</BareAppLayout>
		</LayoutWrapper>
	)
}

export const SettingsLayout = ({ children }: LayoutProps) => {
	return (
		<LayoutWrapper>
			<SpotlightComponent />
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

