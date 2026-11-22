import {
	SYSTEM_CATEGORY_SLUGS,
	type SystemCategoryName,
	type SystemCategorySlug,
	type SystemCategorySlugsFor,
	type SystemCategoryType,
} from "../types/system_categories.generated"

export type { SystemCategoryName, SystemCategorySlug, SystemCategorySlugsFor, SystemCategoryType } from "../types/system_categories.generated"

export function categorySlug<T extends SystemCategoryType, N extends SystemCategoryName<T>>(
	type: T,
	name: N,
): SystemCategorySlug<T, N> {
	return SYSTEM_CATEGORY_SLUGS[type][name]
}

export function isSystemCategorySlug<T extends SystemCategoryType>(
	type: T,
	slug: string,
): slug is SystemCategorySlugsFor<T> {
	return Object.values(SYSTEM_CATEGORY_SLUGS[type]).some((value) => value === slug)
}
