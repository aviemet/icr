import {
	CheckIcon,
	ColorPicker,
	ColorSwatch,
	Group,
	Popover,
	Stack,
	Text,
	rem,
	useMantineTheme,
} from "@mantine/core"
import React, { useMemo } from "react"

import { useFormField } from "@/components/Form"
import { vars } from "@/lib"
import {
	BRAND_COLOR_MAX_LIGHTNESS,
	BRAND_COLOR_MIN_LIGHTNESS,
	clampBrandColor,
	DEFAULT_BRAND_COLOR,
	hexToHsl,
	hslToHex,
} from "@/lib/brandColor"

import { HiddenInput } from "./HiddenInput"
import { InputWrapper } from "./InputWrapper"
import { Label } from "./Label"

import { type BaseInputProps } from "."

const EXCLUDED_SWATCH_COLORS = new Set(["dark", "gray", "brand"])

export interface BrandColorInputProps extends Omit<BaseInputProps, "disableAutofill"> {
	ref?: React.Ref<HTMLInputElement>
	label?: React.ReactNode
	value?: string
	initialValue?: string
	id?: string
	onChange?: (color: string) => void
	wrapperProps?: Record<string, unknown>
}

function normalizeHex(hex: string) {
	return clampBrandColor(hex).toLowerCase()
}

export function BrandColorInput({
	label,
	id,
	name,
	required,
	onChange,
	value: controlledValue,
	initialValue,
	wrapper = true,
	wrapperProps,
	ref,
}: BrandColorInputProps) {
	const theme = useMantineTheme()
	const inputId = id || name
	const [fieldValue, setFieldValue] = useFormField(name)
	const resolvedValue = clampBrandColor(
		(typeof controlledValue === "string" && controlledValue) ||
		(typeof fieldValue === "string" && fieldValue) ||
		initialValue ||
		DEFAULT_BRAND_COLOR
	)

	const handleChange = (nextColor: string) => {
		const clamped = clampBrandColor(nextColor)
		setFieldValue(clamped)
		onChange?.(clamped)
	}

	const handleLightnessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const hsl = hexToHsl(resolvedValue) || { h: 210, s: 0.8, l: 0.45 }
		const nextLightness = Number(event.currentTarget.value) / 100
		handleChange(hslToHex(hsl.h, hsl.s, nextLightness))
	}

	const handleSwatchSelect = (paletteName: string) => {
		const shade = theme.colors[paletteName]?.[6]
		if(!shade) return
		handleChange(shade)
	}

	const lightness = Math.round((hexToHsl(resolvedValue)?.l || 0.45) * 100)
	const normalizedValue = normalizeHex(resolvedValue)

	const paletteNames = useMemo(
		() => Object.keys(theme.colors).filter(color => !EXCLUDED_SWATCH_COLORS.has(color)),
		[theme.colors],
	)

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<Group>
				<Popover position="bottom-start" withArrow>
					<Popover.Target>
						<ColorSwatch
							component="button"
							type="button"
							color={ resolvedValue }
							size={ 36 }
							radius="sm"
							style={ {
								cursor: "pointer",
								border: `1px solid ${ vars.colors.gray[3] }`,
							} }
						/>
					</Popover.Target>
					<Popover.Dropdown>
						<Stack gap="sm" maw={ 260 }>
							<Stack gap={ 4 }>
								<Text size="xs" c="dimmed">Presets</Text>
								<Group gap={ 4 }>
									{ paletteNames.map(paletteName => {
										const shade = theme.colors[paletteName]?.[6]
										if(!shade) return null
										const selected = normalizeHex(shade) === normalizedValue

										return (
											<ColorSwatch
												key={ paletteName }
												color={ shade }
												component="button"
												type="button"
												onClick={ () => handleSwatchSelect(paletteName) }
												radius="sm"
												size={ 22 }
												style={ { cursor: "pointer", color: "#fff" } }
											>
												{ selected && <CheckIcon width={ rem(10) } height={ rem(10) } /> }
											</ColorSwatch>
										)
									}) }
								</Group>
							</Stack>

							<Stack gap={ 4 }>
								<Text size="xs" c="dimmed">Custom</Text>
								<ColorPicker
									format="hex"
									value={ resolvedValue }
									onChange={ handleChange }
									fullWidth
								/>
							</Stack>

							<Stack gap={ 4 }>
								<Text size="xs" c="dimmed">
									Lightness ({ Math.round(BRAND_COLOR_MIN_LIGHTNESS * 100) }%–
									{ Math.round(BRAND_COLOR_MAX_LIGHTNESS * 100) }%)
								</Text>
								<input
									type="range"
									min={ Math.round(BRAND_COLOR_MIN_LIGHTNESS * 100) }
									max={ Math.round(BRAND_COLOR_MAX_LIGHTNESS * 100) }
									value={ lightness }
									onChange={ handleLightnessChange }
									style={ { width: "100%" } }
								/>
							</Stack>
							<Text size="xs" c="dimmed">{ resolvedValue }</Text>
						</Stack>
					</Popover.Dropdown>
				</Popover>
			</Group>
			<HiddenInput value={ resolvedValue } id={ inputId } name={ name } ref={ ref } />
		</InputWrapper>
	)
}
