import React from 'react'
import {
	Form,
	Input,
	Submit,
} from '@/Components/Form'
import { type UseFormProps } from 'use-inertia-form'

type TUserFormData = {
	user: Schema.User
}

export interface IUserFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TUserFormData>) => boolean|void
	user: Schema.User
}

const UserForm = ({ to, method = 'post', onSubmit, user }: IUserFormProps) => {

	return (
		<Form
			data={ { user } }
			to={ to }
			method={ method }
			onSubmit={ onSubmit }
		>
			<Input name="first_name" label="First Name" required autoFocus />

			<Input name="last_name" label="Last Name" required  />

			<Submit>
				{ user.id ? 'Update' : 'Create' } User
			</Submit>
		</Form>
	)
}

export default React.memo(UserForm)
