export const DEFAULT_BRAND_COLOR = "#228be6"
export const BRAND_COLOR_MIN_LIGHTNESS = 0.35
export const BRAND_COLOR_MAX_LIGHTNESS = 0.55

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value))
}

function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
	const normalized = hex.replace("#", "").trim()
	const full = normalized.length === 3
		? normalized.split("").map(char => `${char}${char}`).join("")
		: normalized

	if(!/^[0-9a-fA-F]{6}$/.test(full)) return null

	return {
		r: Number.parseInt(full.slice(0, 2), 16),
		g: Number.parseInt(full.slice(2, 4), 16),
		b: Number.parseInt(full.slice(4, 6), 16),
	}
}

function rgbToHex(r: number, g: number, b: number) {
	const toHex = (channel: number) => Math.round(clamp(channel, 0, 255)).toString(16).padStart(2, "0")
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function hexToHsl(hex: string): { h: number, s: number, l: number } | null {
	const rgb = hexToRgb(hex)
	if(!rgb) return null

	const r = rgb.r / 255
	const g = rgb.g / 255
	const b = rgb.b / 255
	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	const delta = max - min
	const l = (max + min) / 2

	if(delta === 0) {
		return { h: 0, s: 0, l }
	}

	const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)
	let h = 0
	switch(max) {
		case r:
			h = ((g - b) / delta) + (g < b ? 6 : 0)
			break
		case g:
			h = ((b - r) / delta) + 2
			break
		default:
			h = ((r - g) / delta) + 4
	}
	h /= 6

	return { h: h * 360, s, l }
}

function hueToRgb(p: number, q: number, t: number) {
	let tone = t
	if(tone < 0) tone += 1
	if(tone > 1) tone -= 1
	if(tone < 1 / 6) return p + (q - p) * 6 * tone
	if(tone < 1 / 2) return q
	if(tone < 2 / 3) return p + (q - p) * (2 / 3 - tone) * 6
	return p
}

export function hslToHex(h: number, s: number, l: number) {
	const saturation = clamp(s, 0, 1)
	const lightness = clamp(l, 0, 1)

	if(saturation === 0) {
		const channel = lightness * 255
		return rgbToHex(channel, channel, channel)
	}

	const q = lightness < 0.5
		? lightness * (1 + saturation)
		: lightness + saturation - lightness * saturation
	const p = 2 * lightness - q
	const hue = ((h % 360) + 360) % 360 / 360

	return rgbToHex(
		hueToRgb(p, q, hue + 1 / 3) * 255,
		hueToRgb(p, q, hue) * 255,
		hueToRgb(p, q, hue - 1 / 3) * 255,
	)
}

export function clampBrandColor(color: string): string {
	const hsl = hexToHsl(color)
	if(!hsl) return DEFAULT_BRAND_COLOR

	return hslToHex(
		hsl.h,
		hsl.s,
		clamp(hsl.l, BRAND_COLOR_MIN_LIGHTNESS, BRAND_COLOR_MAX_LIGHTNESS),
	)
}

export function isValidBrandColor(color: string): boolean {
	const hsl = hexToHsl(color)
	if(!hsl) return false
	return hsl.l >= BRAND_COLOR_MIN_LIGHTNESS && hsl.l <= BRAND_COLOR_MAX_LIGHTNESS
}
