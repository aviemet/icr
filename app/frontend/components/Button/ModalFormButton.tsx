import { useMantineTheme, type ModalProps, type ButtonProps } from "@mantine/core"
import axios, { type Method } from "axios"
import React from "react"
import { type FormDataConvertible } from "@inertiajs/core"

import { type FormProps } from "@/components/Form"
import { Modal } from "@/components"

import { Button } from "./index"

const methodToAxios: Record<string, Method> = {
	get: "get",
	post: "post",
	put: "put",
	patch: "patch",
	delete: "delete",
}

interface ModalFormButtonProps {
	children?: string | React.ReactElement
	form: React.ReactElement<FormProps<Record<string, FormDataConvertible>>>
	title: React.ReactNode
	buttonProps?: ButtonProps
	modalProps?: Partial<ModalProps>
	onSuccess?: (data: { id: string | number }) => void
}

function buildAxiosSubmitWith(
	form: React.ReactElement<FormProps<Record<string, FormDataConvertible>>>,
	onSuccess?: (data: { id: string | number }) => void
) {
	return async (data: Record<string, FormDataConvertible>) => {
		const action = form.props.action
		if(typeof action !== "string" || !action) return
		const rawMethod = (form.props.method ?? "post").toString().toLowerCase()
		const httpMethod = methodToAxios[rawMethod] ?? "post"
		const response = await axios[httpMethod](action, { ...data, redirect: false })
		if((response.statusText === "OK" || response.statusText === "Created") && onSuccess) {
			onSuccess(response.data)
		}
	}
}

export function ModalFormButton({
	children = "New",
	form,
	title,
	buttonProps = {},
	modalProps = {},
	onSuccess,
}: ModalFormButtonProps) {
	const theme = useMantineTheme()
	const submitWith = form.props.submitWith ?? buildAxiosSubmitWith(form, onSuccess)

	return (
		<Modal
			trigger={ <Button { ...buttonProps } >{ children }</Button> }
			title={ title }
			{ ...Object.assign({ size: theme.breakpoints.md }, modalProps) }
		>
			{ React.cloneElement(form, { submitWith }) }
		</Modal>
	)
}
