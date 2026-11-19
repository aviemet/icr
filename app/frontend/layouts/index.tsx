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

export function LayoutWrapper({ children }: LayoutProps) {
	return (
		<Providers>
			<Flash />
			{ children }
		</Providers>
	)
}

export function AuthLayout({ children }: LayoutProps) {
	return (
		<LayoutWrapper>
			<BareAuthLayout>
				{ children }
			</BareAuthLayout>
		</LayoutWrapper>
	)
}

export function AppLayout({ children }: LayoutProps) {
	return (
		<LayoutWrapper>
			<SpotlightComponent />
			<BareAppLayout>
				{ children }
			</BareAppLayout>
		</LayoutWrapper>
	)
}

export function SettingsLayout({ children }: LayoutProps) {
	return (
		<LayoutWrapper>
			<SpotlightComponent />
			<BareSettingsLayout>
				{ children }
			</BareSettingsLayout>
		</LayoutWrapper>
	)
}

export function PublicLayout({ children }: LayoutProps) {
	return (
		<LayoutWrapper>
			<BarePublicLayout>
				{ children }
			</BarePublicLayout>
		</LayoutWrapper>
	)
}

