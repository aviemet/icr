import { useCallback } from "react"

import { usePageProps } from "./usePageProps"

export type FeatureKey = keyof SharedInertiaFeatures

type SharedInertiaFeatures = {
	compliance_forms: boolean
}

export function useFeatures() {
	const { features } = usePageProps()

	const enabled = useCallback((feature: FeatureKey) => {
		return Boolean(features?.[feature])
	}, [features])

	return { enabled, features }
}
