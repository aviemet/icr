import { type ComponentPropsWithRef } from "react"

export function HiddenInput({ name, id, ref, ...props }: ComponentPropsWithRef<"input">) {
	const inputId = id || name

	return (
		<input
			ref={ ref }
			name={ name }
			id={ inputId }
			type="hidden"
			{ ...props }
		/>
	)
}
