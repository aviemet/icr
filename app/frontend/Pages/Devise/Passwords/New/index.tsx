import React from 'react'
import { Heading, Link } from '@/Components'
import { Field, Form, TextInput, Submit } from '@/Components/Form'
import { Routes } from '@/lib'
import { LAYOUTS } from '@/Layouts'

type TPasswordsNewFormData = {
	email: string
}

const PasswordsNew = () => {
	const defaultData: TPasswordsNewFormData = {
		email: '',
	}

	return (
		<Form model="user" data={ defaultData } to={ Routes.newUserPassword() }>
			<div>
				<Heading>Reset Password</Heading>
			</div>

			<Field>
				<TextInput name="email" placeholder="Email" autoFocus autoComplete="Email" />
			</Field>

			<Field>
				<Submit>Send Reset Instructions</Submit>
			</Field>

			<Link href={ Routes.newUserSession() }>Log In</Link>
		</Form>
	)
}

PasswordsNew.defaultLayout = LAYOUTS.auth

export default PasswordsNew
