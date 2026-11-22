import { type ButtonProps } from "@mantine/core"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components"
import { useFormFieldContext, useSlotProps } from "@/components/Form"

interface SettingsSaveButtonProps extends ButtonProps {
	children?: React.ReactNode
}

function serializeFormData(data: Record<string, unknown>): string {
	return JSON.stringify(data)
}

export function SettingsSaveButton({
	children,
	disabled,
	...props
}: SettingsSaveButtonProps) {
	const { t } = useTranslation()
	const buttonRef = useRef<HTMLButtonElement>(null)
	const baselineRef = useRef<string | null>(null)
	const [isDirty, setIsDirty] = useState(false)
	const { getFormData, subscribeFormData } = useFormFieldContext()
	const slotProps = useSlotProps()
	const label = children ?? t("views.settings.save")

	const captureBaseline = useCallback(() => {
		baselineRef.current = serializeFormData(getFormData())
		setIsDirty(false)
	}, [getFormData])

	const recomputeDirty = useCallback(() => {
		if(baselineRef.current === null) return
		setIsDirty(serializeFormData(getFormData()) !== baselineRef.current)
	}, [getFormData])

	useEffect(() => {
		let innerFrame = 0
		const outerFrame = requestAnimationFrame(() => {
			innerFrame = requestAnimationFrame(captureBaseline)
		})

		return () => {
			cancelAnimationFrame(outerFrame)
			cancelAnimationFrame(innerFrame)
		}
	}, [captureBaseline])

	useEffect(() => {
		return subscribeFormData(() => {
			recomputeDirty()
		})
	}, [subscribeFormData, recomputeDirty])

	useEffect(() => {
		const form = buttonRef.current?.form
		if(!form) return

		const handleFormEvent = () => {
			recomputeDirty()
		}

		form.addEventListener("input", handleFormEvent)
		form.addEventListener("change", handleFormEvent)

		return () => {
			form.removeEventListener("input", handleFormEvent)
			form.removeEventListener("change", handleFormEvent)
		}
	}, [recomputeDirty])

	const isDisabled = Boolean(disabled) || Boolean(slotProps?.processing) || !isDirty

	return (
		<Button
			type="submit"
			size="sm"
			ref={ buttonRef }
			{ ...props }
			disabled={ isDisabled }
		>
			{ slotProps?.processing ? t("views.settings.saving") : label }
		</Button>
	)
}
