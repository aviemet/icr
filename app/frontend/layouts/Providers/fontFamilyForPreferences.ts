const OPENDYSLEXIC = "OpenDyslexic, sans-serif"

export function fontFamilyForPreferences(dyslexiaFont: boolean): string | undefined {
	if(!dyslexiaFont) return undefined
	return OPENDYSLEXIC
}

export function themeFontOverridesForPreferences(dyslexiaFont: boolean): {
	fontFamily: string
	headings: { fontFamily: string }
} | Record<string, never> {
	const fontFamily = fontFamilyForPreferences(dyslexiaFont)
	if(!fontFamily) return {}

	return {
		fontFamily,
		headings: { fontFamily },
	}
}
