import clsx from "clsx"
import { useId } from "react"

import * as classes from "./DropzoneField.css"

export interface DropzoneFieldProps {
	label: string
	hint?: string
	accept?: string
	onSelect: (files: FileList | null) => void
	className?: string
}

export function DropzoneField({ label, hint, accept, onSelect, className }: DropzoneFieldProps) {
	const inputId = useId()

	return (
		<label htmlFor={ inputId } className={ clsx(classes.dropzone, className) }>
			<span className={ classes.label }>{ label }</span>
			{ hint && <span className={ classes.hint }>{ hint }</span> }
			<input
				id={ inputId }
				type="file"
				accept={ accept }
				className={ classes.input }
				onChange={ event => {
					onSelect(event.target.files)
					event.target.value = ""
				} }
			/>
		</label>
	)
}
